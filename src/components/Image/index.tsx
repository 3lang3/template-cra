import type { CSSProperties } from 'react';
import React, { useState, useCallback } from 'react';
import cn from 'classnames';
import { Pic, DamageMap } from '@icon-park/react';
import './image.less';

type ObjectFitType = 'fill' | 'cover' | 'contain' | 'none';
type ImageRenderStatus = 'loading' | 'success' | 'error';

type ImageProps = {
  /**
   * 图片链接
   */
  src: string;
  /**
   * 是否显示为圆形
   */
  round?: boolean;
  /**
   * 图片填充模式
   */
  fit?: ObjectFitType;
  /**
   * 替代文本
   */
  alt?: string;
  style?: CSSProperties;
  className?: string;
  /**
   * 图片加载失败时ui
   */
  children?: React.ReactNode;
  /**
   * 加载时提示的icon
   */
  loadingIcon?: React.ReactNode;
  /**
   * 失败时提示的icon
   */
  errorIcon?: React.ReactNode;
};

const imageIntersectionObserverSymbol = Symbol('local image IntersectionObserver Symbol');

/** @todo 何时销毁IntersectionObserver */
window[imageIntersectionObserverSymbol] = (undefined as unknown) as IntersectionObserver;

export default (props: ImageProps) => {
  const [status, setStatus] = useState<ImageRenderStatus>('loading');
  const {
    src,
    round,
    fit,
    alt,
    className,
    style,
    children,
    loadingIcon = <Pic theme="filled" strokeWidth={3} />,
    errorIcon = <DamageMap theme="outline" strokeWidth={3} />,
  } = props;

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
    if (!src && children)
      return React.cloneElement(children as any, { className: 'local-image__img' });
    const defaultAttrs = {
      className: cn('local-image__img'),
      'data-origin': src,
      alt,
      style: { objectFit: fit },
      /** @question 是否会有内存泄露问题? */
      onLoad: () => setStatus('success'),
      onError: () => setStatus('error'),
    };
    return <img {...defaultAttrs} ref={measuredRef} />;
  };

  const renderStatus = () => {
    if (status === 'success' || (!src && children)) return null;
    return (
      <div className={`local-image__${status}`}>
        {status === 'error' ? children || errorIcon : loadingIcon}
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
      {renderStatus()}
    </div>
  );
};
