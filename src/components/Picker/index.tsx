/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { useSetState } from 'ahooks';
import { useCallback, useRef, useEffect } from 'react';
import { useTouch } from '../hooks/useTouch';
import { isObject, preventDefault, range } from '../utils';
import './picker.less';

const DEFAULT_DURATION = 200;
const MOMENTUM_LIMIT_TIME = 300;
const MOMENTUM_LIMIT_DISTANCE = 15;

function getElementTranslateY(element: Element) {
  const style = window.getComputedStyle(element);
  const { transform } = style;
  const translateY = transform.slice(7, transform.length - 1).split(', ')[5];

  return Number(translateY);
}

function isOptionDisabled(option: any) {
  return isObject(option) && option.disabled;
}

export default () => {
  const [state, set] = useSetState({
    index: 0,
    offset: 0,
    duration: 0,
    options: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
  });
  const domRef = useRef<HTMLDivElement>();
  const wrapper = useRef<HTMLUListElement>(null);

  const offsetRef = useRef(0);
  const indexRef = useRef(0);

  const moving = useRef(false);
  const startOffset = useRef(0);
  const touchStartTime = useRef(0);
  const momentumOffset = useRef(0);
  const transitionEndTrigger = useRef<any>(null);

  const touch = useTouch();

  offsetRef.current = state.offset;
  indexRef.current = state.index;

  const baseOffset = () => (44 * 5) / 2;

  const count = () => state.options.length;

  const getIndexByOffset = (offset: number) => range(Math.round(-offset / 44), 0, count() - 1);

  const adjustIndex = (index: number) => {
    index = range(index, 0, count());

    for (let i = index; i < count(); i++) {
      if (!isOptionDisabled(state.options[i])) return i;
    }
    for (let i = index - 1; i >= 0; i--) {
      if (!isOptionDisabled(state.options[i])) return i;
    }
    return index;
  };

  const setIndex = (index: number, emitChange?: boolean) => {
    index = adjustIndex(index) || 0;

    const offset = -index * 44;
    const trigger = () => {
      if (index !== indexRef.current) {
        set({ index });
        if (emitChange) {
          // eslint-disable-next-line no-console
          console.log('pick index:', index);
        }
      }
    };

    // trigger the change event after transitionend when moving
    if (moving.current && offset !== offsetRef.current) {
      transitionEndTrigger.current = trigger;
    } else {
      trigger();
    }
    set({ offset });
  };

  const stopMomentum = () => {
    moving.current = false;
    set({ duration: 0 });
    if (transitionEndTrigger.current) {
      transitionEndTrigger.current();
      transitionEndTrigger.current = null;
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    touch.start(event);

    if (moving.current) {
      const translateY = getElementTranslateY(wrapper.current!);
      set({ offset: Math.min(0, translateY - baseOffset()) });
      startOffset.current = offsetRef.current;
    } else {
      startOffset.current = offsetRef.current;
    }

    set({ duration: 0 });
    touchStartTime.current = Date.now();
    momentumOffset.current = startOffset.current;
    transitionEndTrigger.current = null;
  };

  const onTouchMove = (event: TouchEvent) => {
    touch.move(event);

    if (touch.isVertical()) {
      moving.current = true;
      preventDefault(event, true);
    }
    set({
      offset: range(startOffset.current + touch.deltaY.current, -(count() * 44), 44),
    });
    const now = Date.now();
    if (now - touchStartTime.current > MOMENTUM_LIMIT_TIME) {
      touchStartTime.current = now;
      momentumOffset.current = offsetRef.current;
    }
  };

  const momentum = (distance: number, duration: number) => {
    const speed = Math.abs(distance / duration);

    distance = offsetRef.current + (speed / 0.003) * (distance < 0 ? -1 : 1);

    const index = getIndexByOffset(distance);
    set({ duration: 1000 });
    setIndex(index, true);
  };

  const onTouchEnd = () => {
    const distance = offsetRef.current - momentumOffset.current;
    const duration = Date.now() - touchStartTime.current;
    const allowMomentum =
      duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;

    if (allowMomentum) {
      momentum(distance, duration);
      return;
    }
    const index = getIndexByOffset(offsetRef.current);
    set({ duration: DEFAULT_DURATION });
    setIndex(index, true);

    // compatible with desktop scenario 39829980 26222633
    // use setTimeout to skip the click event Emitted after touchstart
    setTimeout(() => {
      moving.current = false;
    }, 0);
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

  const wrapperStyle = {
    transform: `translate3d(0, ${offsetRef.current + baseOffset()}px, 0)`,
    transitionDuration: `${state.duration}ms`,
    transitionProperty: state.duration ? 'all' : 'none',
  };

  return (
    <div className="local-picker">
      <div className="local-picker__toolbar">
        <button className="local-picker__cancel">取消</button>
        <div className="local-ellipsis local-picker__title">标题</div>
        <button className="local-picker__confirm">确认</button>
      </div>
      <div className="local-picker__columns" style={{ height: 264 }}>
        <div className="local-picker-column" ref={measuredRef}>
          <ul
            className="local-picker-column__wrapper"
            ref={wrapper}
            onTransitionEnd={stopMomentum}
            style={wrapperStyle}
          >
            {state.options.map((el) => (
              <li key={el} className="local-picker-column__item">
                <div className="local-ellipsis">{el}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="local-picker__mask" />
        <div className="local-hairline-unset--top-bottom local-picker__frame" />
      </div>
    </div>
  );
};
