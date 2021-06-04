export * from './namespace';

export type ScrollElement = Element | Window;

export const defaultRoot = window;

export function getScrollTop(el: ScrollElement): number {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset;

  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0);
}

export function stopPropagation(event: Event) {
  event.stopPropagation();
}

export function preventDefault(event: TouchEvent, isStopPropagation?: boolean) {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}

export function range(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object';
}
