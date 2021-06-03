/* eslint-disable no-param-reassign */
import { useSetState } from 'ahooks';
import { useRef, useCallback, useEffect } from 'react';
import { getScrollTop, preventDefault } from '../utils';
import { useScrollParent } from './useScrollParent';
import { useTouch } from './useTouch';
import './pullrefresh.less';

const DEFAULT_HEAD_HEIGHT = 50;
const TEXT_STATUS = ['pulling', 'loosing', 'success'];

const bem = (str?: string) => (str ? `local-pull-refresh__${str}` : 'local-pull-refresh');

type PullRefreshStatus = 'normal' | 'loading' | 'loosing' | 'pulling' | 'success';

export type PullRefreshProps = {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 刷新成功文案
   * @default '刷新成功'
   */
  successText?: string;
  /**
   * 下拉文案
   * @default '下拉即可刷新'
   */
  pullingText?: string;
  /**
   * 释放文案
   * @default '释放即可刷新'
   */
  loosingText?: string;
  /**
   * 加载中文案
   * @default '加载中...'
   */
  loadingText?: string;
  /**
   * 最短下拉距离
   * @default 50
   */
  pullDistance?: number | string;
  /**
   * 下拉成功动画时长
   * @default 500
   */
  successDuration?: number | string;
  /**
   * 下拉动画时长
   * @default 300
   */
  animationDuration?: number | string;
  /**
   * 下拉ui区域高度
   */
  headHeight?: number | string;
  /**
   * 下拉刷新回调
   */
  refresh?: () => Promise<any>;
  children: React.ReactNode;
};

export default ({
  disabled,
  pullDistance,
  successDuration = 500,
  animationDuration = 300,
  headHeight = DEFAULT_HEAD_HEIGHT,
  successText = '刷新成功',
  pullingText = '下拉即可刷新',
  loosingText = '释放即可刷新',
  loadingText = '加载中...',
  children,
  ...props
}: PullRefreshProps) => {
  const domRef = useRef<HTMLDivElement>();
  const reachTop = useRef(false);
  const statusRef = useRef<PullRefreshStatus>('normal');
  const root = useRef<any>();
  const scrollParent = useScrollParent(root);

  const [state, set] = useSetState({
    status: 'normal' as PullRefreshStatus,
    distance: 0,
    duration: 0,
  });

  const touch = useTouch();

  statusRef.current = state.status;

  const getHeadStyle = () => {
    if (headHeight !== DEFAULT_HEAD_HEIGHT) {
      return {
        height: `${headHeight}px`,
      };
    }
    return { height: 'auto' };
  };

  const isTouchable = () =>
    statusRef.current !== 'loading' && statusRef.current !== 'success' && !disabled;

  const ease = (distance: number) => {
    const pd = +(pullDistance || headHeight);

    if (distance > pd) {
      if (distance < pd * 2) {
        distance = pd + (distance - pd) / 2;
      } else {
        distance = pd * 1.5 + (distance - pd * 2) / 4;
      }
    }

    return Math.round(distance);
  };

  const setStatus = (distance: number, isLoading?: boolean) => {
    const pd = +(pullDistance || headHeight);
    let status: PullRefreshStatus;
    if (isLoading) {
      status = 'loading';
    } else if (distance === 0) {
      status = 'normal';
    } else if (distance < pd) {
      status = 'pulling';
    } else {
      status = 'loosing';
    }
    set({ distance, status });
  };

  const getStatusText = () => {
    const status = statusRef.current;
    if (status === 'success') return successText;
    if (status === 'pulling') return pullingText;
    if (status === 'loosing') return loosingText;
    if (status === 'loading') return loadingText;
    return '';
  };

  const renderStatus = () => {
    const status = statusRef.current;

    const nodes: any[] = [];

    if (TEXT_STATUS.includes(status)) {
      nodes.push(
        <div key={status} className={bem('text')}>
          {getStatusText()}
        </div>,
      );
    }
    if (status === 'loading') {
      nodes.push(
        <div key={status} className={bem('loading')}>
          {getStatusText()}
        </div>,
      );
    }

    return nodes;
  };

  const showSuccessTip = () => {
    set({ status: 'success' });
    setTimeout(() => {
      setStatus(0);
    }, +successDuration);
  };

  const checkPosition = (event: TouchEvent) => {
    reachTop.current = getScrollTop(scrollParent.current!) === 0;

    if (reachTop.current) {
      set({ duration: 0 });
      touch.start(event);
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    if (isTouchable()) {
      checkPosition(event);
    }
  };

  const onTouchMove = (event: TouchEvent) => {
    if (isTouchable()) {
      if (!reachTop.current) {
        checkPosition(event);
      }

      const { deltaY } = touch;
      touch.move(event);

      if (reachTop.current && deltaY.current >= 0 && touch.isVertical()) {
        preventDefault(event);
        setStatus(ease(deltaY.current));
      }
    }
  };

  const done = () => {
    showSuccessTip();
  };

  const onTouchEnd = () => {
    if (reachTop.current && touch.deltaY.current && isTouchable()) {
      set({ duration: +animationDuration });
      if (statusRef.current === 'loosing') {
        setStatus(+headHeight, true);
        /**
         * @todo refresh应该是个promise，无需回调done
         */
        setImmediate(async () => {
          try {
            await props.refresh?.();
            done();
          } catch (error) {
            throw Error(error);
          }
        });
      } else {
        setStatus(0);
      }
    }
  };

  const measuredRef = useCallback((node) => {
    if (!node) return;
    domRef.current = node;
    node.addEventListener('touchstart', onTouchStart);
    node.addEventListener('touchmove', onTouchMove);
    node.addEventListener('touchend', onTouchEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (domRef.current) {
        domRef.current.removeEventListener('touchstart', onTouchStart as any);
        domRef.current.removeEventListener('touchmove', onTouchMove as any);
        domRef.current.removeEventListener('touchend', onTouchEnd);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackStyle = {
    transitionDuration: `${state.duration}ms`,
    transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : '',
  };

  return (
    <div ref={root} className={bem()}>
      <div className={bem('track')} style={trackStyle} ref={measuredRef}>
        <div className={bem('head')} style={getHeadStyle()}>
          {renderStatus()}
        </div>
        {children}
      </div>
    </div>
  );
};
