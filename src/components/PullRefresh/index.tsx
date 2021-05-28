/* eslint-disable no-param-reassign */
import { useSetState } from 'ahooks';
import type { TouchEvent } from 'react';
import { useRef } from 'react';
import { preventDefault, getScrollTop } from '../utils';
import { useScrollParent } from './useScrollParent';
import { useTouch } from './useTouch';
import './pullrefresh.less';

const DEFAULT_HEAD_HEIGHT = 50;
const TEXT_STATUS = ['pulling', 'loosing', 'success'];

const bem = (str?: string) => (str ? `local-pull-refresh__${str}` : 'local-pull-refresh');

type PullRefreshStatus = 'normal' | 'loading' | 'loosing' | 'pulling' | 'success';

type PullRefreshProps = {
  disabled?: boolean;
  successText?: string;
  pullingText?: string;
  loosingText?: string;
  loadingText?: string;
  pullDistance?: number | string;
  successDuration?: number | string;
  animationDuration?: number | string;
  headHeight?: number | string;
  refresh?: (done: () => void) => void;
  children: React.ReactNode;
};

export default ({
  disabled,
  pullDistance,
  successDuration = 500,
  animationDuration = 300,
  headHeight = DEFAULT_HEAD_HEIGHT,
  children,
  ...props
}: PullRefreshProps) => {
  const reachTop = useRef(false);
  const modelValue = useRef(false);

  const root = useRef<any>();
  const scrollParent = useScrollParent(root);

  const [state, set] = useSetState({
    status: 'normal' as PullRefreshStatus,
    distance: 0,
    duration: 0,
  });

  const touch = useTouch();

  const getHeadStyle = () => {
    if (headHeight !== DEFAULT_HEAD_HEIGHT) {
      return {
        height: `${headHeight}px`,
      };
    }
    return { height: 'auto' };
  };

  const isTouchable = () => state.status !== 'loading' && state.status !== 'success' && !disabled;

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
    set({ distance });
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
    set({ status });
  };

  const getStatusText = () => {
    const { status } = state;
    if (status === 'normal') {
      return '';
    }
    return props[`${status}Text` as const];
  };

  const renderStatus = () => {
    const { status } = state;

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
      touch.start(event as any);
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
      touch.move(event as any);

      if (reachTop.current && deltaY.current >= 0 && touch.isVertical()) {
        preventDefault(event as any);
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
      if (state.status === 'loosing') {
        setStatus(+headHeight, true);
        modelValue.current = true;
        // ensure value change can be watched
        setImmediate(() => (props.refresh ? props.refresh(done) : null));
      } else {
        setStatus(0);
      }
    }
  };

  const trackStyle = {
    transitionDuration: `${state.duration}ms`,
    transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : '',
  };

  return (
    <div ref={root} className={bem()}>
      <div
        className={bem('track')}
        style={trackStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div className={bem('head')} style={getHeadStyle()}>
          {renderStatus()}
        </div>
        {children}
      </div>
    </div>
  );
};
