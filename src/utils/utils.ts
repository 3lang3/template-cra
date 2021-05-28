/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

// 获取token
export const getToken = (): string => {
  return window.localStorage.getItem('authorization_token') || '';
};
// 设置token
export const setToken = (newToken: string) => {
  return window.localStorage.setItem('authorization_token', newToken);
};
export const removeToken = () => {
  return window.localStorage.removeItem('authorization_token');
};

export const getCookie = (name) => {
  let arr;
  const regp = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  // eslint-disable-next-line no-multi-assign
  const rs = (arr = document.cookie.match(regp));
  if (rs) {
    return unescape(arr[2]);
  }
  return null;
};

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

/**
 * @name 数组项移动
 * @param arr 数组
 * @param from 初始位置
 * @param to 到达位置
 */
export function arrayMove(arr, from, to) {
  const array = arr.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}

/**
 * 获取指定启始位置的区间数组
 * @param start
 * @param end
 */
export function range(start, end) {
  const result: any = [];
  // eslint-disable-next-line no-plusplus
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
