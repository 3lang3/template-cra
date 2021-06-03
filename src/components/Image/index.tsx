import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import cn from 'classnames';
import { Pic, DamageMap } from '@icon-park/react';
import './image.less';

type ObjectFitType = 'fill' | 'cover' | 'contain' | 'none';
type ImageRenderStatus = 'loading' | 'success' | 'error';

type ImageProps = {
  src: string;
  round?: boolean;
  placeholder?: string;
  fit?: ObjectFitType;
  alt?: string;
  style?: CSSProperties;
  className?: string;
};

const imageIntersectionObserverSymbol = Symbol('local image IntersectionObserver Symbol');

/** @todo 何时销毁IntersectionObserver */
window[imageIntersectionObserverSymbol] = (undefined as unknown) as IntersectionObserver;

export default (props: ImageProps) => {
  const [status, setStatus] = useState<ImageRenderStatus>('loading');
  const { src, round, fit, alt, className, style } = props;

  const measuredRef = useCallback((node: HTMLImageElement) => {
    if (!node) return;
    if (!window[imageIntersectionObserverSymbol]) {
      // 初始化全局IntersectionObserver
      window[imageIntersectionObserverSymbol] = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLImageElement;
            el.src = el.dataset.origin as string;
            window[imageIntersectionObserverSymbol].unobserve(el);
          }
        });
      });
    }
    window[imageIntersectionObserverSymbol].observe(node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderImage = () => {
    const defaultAttrs = {
      className: cn('local-image__img'),
      'data-origin': src,
      alt,
      style: { objectFit: fit },
      onLoad: () => setStatus('success'),
      onError: () => setStatus('error'),
    };
    return <img {...defaultAttrs} ref={measuredRef} />;
  };

  const renderPlaceholder = () => {
    if (status === 'success') return null;
    return (
      <div className={`local-image__${status}`}>
        {status === 'error' ? (
          <DamageMap theme="outline" strokeWidth={3} />
        ) : (
          <Pic theme="filled" strokeWidth={3} />
        )}
      </div>
    );
  };

  return (
    <div
      style={style}
      className={cn('local-image', className, {
        'local-image--round': round,
      })}
    >
      {renderImage()}
      {renderPlaceholder()}
    </div>
  );
};
