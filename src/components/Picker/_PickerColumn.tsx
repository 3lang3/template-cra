/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { useRef, useEffect } from 'react';
import cn from 'classnames';
import { stringify, parse } from 'querystring';

import { range, isObject, preventDefault, createNamespace } from '../utils';

// Composables
import { useTouch } from '../hooks/useTouch';
import { useSetState } from 'ahooks';

const deepClone = (obj: any) => parse(stringify(obj));

const DEFAULT_DURATION = 200;

// 惯性滑动思路:
// 在手指离开屏幕时，如果和上一次 move 时的间隔小于 `MOMENTUM_LIMIT_TIME` 且 move
// 距离大于 `MOMENTUM_LIMIT_DISTANCE` 时，执行惯性滑动
const MOMENTUM_LIMIT_TIME = 300;
const MOMENTUM_LIMIT_DISTANCE = 15;

const [name, bem] = createNamespace('picker-column');

function getElementTranslateY(element: Element) {
  const style = window.getComputedStyle(element);
  const transform = style.transform || style.webkitTransform;
  const translateY = transform.slice(7, transform.length - 1).split(', ')[5];

  return Number(translateY);
}

export const PICKER_KEY = Symbol(name);

export type PickerObjectOption = {
  text?: string;
  disabled?: boolean;
  // for custom filed names
  [key: string]: any;
};

export type PickerOption = string | PickerObjectOption;

export type PickerObjectColumn = {
  values?: PickerOption[];
  children?: PickerColumn;
  className?: unknown;
  defaultIndex?: number;
  // for custom filed names
  [key: string]: any;
};

export type PickerColumn = PickerOption[] | PickerObjectColumn;

function isOptionDisabled(option: PickerOption) {
  return isObject(option) && option.disabled;
}

type PickerColumnProps = {
  readonly?: boolean;
  allowHtml?: boolean;
  className?: string;
  textKey: string;
  itemHeight: number;
  swipeDuration: number | string;
  visibleItemCount: number | string;
  defaultIndex?: number;
  initialOptions?: PickerOption[];
};

export default (props: PickerColumnProps) => {
  let moving: boolean;
  let startOffset: number;
  let touchStartTime: number;
  let momentumOffset: number;
  let transitionEndTrigger: null | (() => void);

  const wrapper = useRef<HTMLUListElement>(null);

  const [state, setState] = useSetState<{
    index: number;
    offset: number;
    duration: number;
    options: PickerOption[];
  }>({
    index: props.defaultIndex || 0,
    offset: 0,
    duration: 0,
    options: (deepClone(props.initialOptions) as unknown) as any[],
  });

  const touch = useTouch();

  const count = () => state.options.length;

  const baseOffset = () => (props.itemHeight * (+props.visibleItemCount - 1)) / 2;

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

    const offset = -index * props.itemHeight;
    const trigger = () => {
      if (index !== state.index) {
        setState({ index });
        if (emitChange) {
          console.log('change', index);
        }
      }
    };

    // trigger the change event after transitionend when moving
    if (moving && offset !== state.offset) {
      transitionEndTrigger = trigger;
    } else {
      trigger();
    }
    setState({ offset });
  };

  const setOptions = (options: PickerOption[]) => {
    if (JSON.stringify(options) !== JSON.stringify(state.options)) {
      setState({ options: deepClone(options) as any });
      setIndex(props.defaultIndex as number);
    }
  };

  const onClickItem = (index: number) => {
    if (moving || props.readonly) {
      return;
    }

    transitionEndTrigger = null;
    setState({ duration: DEFAULT_DURATION });

    setIndex(index, true);
  };

  const getOptionText = (option: PickerOption) => {
    if (isObject(option) && props.textKey in option) {
      return option[props.textKey];
    }
    return option;
  };

  const getIndexByOffset = (offset: number) =>
    range(Math.round(-offset / props.itemHeight), 0, count() - 1);

  const momentum = (distance: number, duration: number) => {
    const speed = Math.abs(distance / duration);

    distance = state.offset + (speed / 0.003) * (distance < 0 ? -1 : 1);

    const index = getIndexByOffset(distance);

    setState({ duration: +props.swipeDuration });
    setIndex(index, true);
  };

  const stopMomentum = () => {
    moving = false;
    setState({ duration: 0 });
    if (transitionEndTrigger) {
      transitionEndTrigger();
      transitionEndTrigger = null;
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    if (props.readonly) {
      return;
    }

    touch.start(event);

    if (moving) {
      const translateY = getElementTranslateY(wrapper.current!);
      setState({ offset: Math.min(0, translateY - baseOffset()) });
      startOffset = state.offset;
    } else {
      startOffset = state.offset;
    }

    setState({ duration: 0 });
    touchStartTime = Date.now();
    momentumOffset = startOffset;
    transitionEndTrigger = null;
  };

  const onTouchMove = (event: TouchEvent) => {
    if (props.readonly) {
      return;
    }

    touch.move(event);

    if (touch.isVertical()) {
      moving = true;
      preventDefault(event, true);
    }
    setState({
      offset: range(
        startOffset + touch.deltaY.current,
        -(count() * props.itemHeight),
        props.itemHeight,
      ),
    });
    const now = Date.now();
    if (now - touchStartTime > MOMENTUM_LIMIT_TIME) {
      touchStartTime = now;
      momentumOffset = state.offset;
    }
  };

  const onTouchEnd = () => {
    if (props.readonly) {
      return;
    }

    const distance = state.offset - momentumOffset;
    const duration = Date.now() - touchStartTime;
    const allowMomentum =
      duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;

    if (allowMomentum) {
      momentum(distance, duration);
      return;
    }

    const index = getIndexByOffset(state.offset);
    setState({ duration: DEFAULT_DURATION });
    setIndex(index, true);

    // compatible with desktop scenario
    // use setTimeout to skip the click event Emitted after touchstart
    setTimeout(() => {
      moving = false;
    }, 0);
  };

  const renderOptions = () => {
    const optionStyle = {
      height: `${props.itemHeight}px`,
    };

    return state.options.map((option, index: number) => {
      const text = getOptionText(option);
      const disabled = isOptionDisabled(option);

      const data = {
        role: 'button',
        style: optionStyle,
        tabindex: disabled ? -1 : 0,
        class: bem('item', {
          disabled,
          selected: index === state.index,
        }),
        onClick: () => onClickItem(index),
      };

      const childData = {
        className: 'van-ellipsis',
        [props.allowHtml ? 'innerHTML' : 'textContent']: text,
      };

      return (
        <li {...data}>
          <div {...childData} />
        </li>
      );
    });
  };

  setIndex(state.index);

  useEffect(() => {
    setOptions(props.initialOptions || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringify(props.initialOptions as any)]);

  useEffect(() => {
    setIndex(props.defaultIndex || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringify(props.defaultIndex as any)]);

  const wrapperStyle = {
    transform: `translate3d(0, ${state.offset + baseOffset()}px, 0)`,
    transitionDuration: `${state.duration}ms`,
    transitionProperty: state.duration ? 'all' : 'none',
  };

  return (
    <div
      className={cn(bem(), props.className)}
      onTouchStart={onTouchStart as any}
      onTouchMove={onTouchMove as any}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <ul
        ref={wrapper}
        style={wrapperStyle}
        className={bem('wrapper')}
        onTransitionEnd={stopMomentum}
      >
        {renderOptions()}
      </ul>
    </div>
  );
};
