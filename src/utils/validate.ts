export const inBrowser = typeof window !== 'undefined';

export function isDef<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null;
}

export function isFunction(val: unknown): boolean {
  return typeof val === 'function';
}

export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object';
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export function isDate(val: unknown): val is Date {
  return (
    Object.prototype.toString.call(val) === '[object Date]' &&
    !Number.isNaN((val as Date).getTime())
  );
}

export function isMobile(value: string): boolean {
  // eslint-disable-next-line no-param-reassign
  value = value.replace(/[^-|\d]/g, '');
  return /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value);
}

export function isNumeric(val: string | number): boolean {
  return typeof val === 'number' || /^\d+(\.\d+)?$/.test(val);
}

export function isAndroid(): boolean {
  return inBrowser ? /android/.test(navigator.userAgent.toLowerCase()) : false;
}

export function isIOS(): boolean {
  return inBrowser ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : false;
}

/**
 * 空值判断
 * @return {boolean}
 */
export const isNil = (value: any) => value === null || value === undefined;

/**
 * 空对象判断
 * @return {boolean}
 */
export const isNilObject = (obj) =>
  !(
    Object.prototype.toString.call(obj) === '[Object Object]' &&
    Object.getOwnPropertyNames(obj).length
  );
