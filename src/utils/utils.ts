import { STORAGE } from '@/config/constant';
import { BROWSER_ENV } from '@/config/ua';
import app from './app';

/** cookie获取 */
export const getCookie = (name: string) => {
  let arr;
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  // eslint-disable-next-line no-multi-assign
  const rs = (arr = document.cookie.match(reg));
  if (rs) {
    return unescape(arr[2]);
  }
  return null;
};

/** @name token操作集 */
export const tokenHelper = {
  /**
   * @name 获取token
   *
   * 1. 获取本地缓存token
   * 2. 在webview中调用`app.event.getToken()`, app写入token，再读取返回
   */
  get: () => {
    const localToken =
      getCookie('token') || window.localStorage.getItem(STORAGE.TOKEN);
    if (localToken) return localToken;
    if (BROWSER_ENV.WEBVIEW) app.event.getToken();
    return window.localStorage.getItem(STORAGE.TOKEN) || '';
  },
  /** 设置token */
  set: (value: string) => window.localStorage.setItem(STORAGE.TOKEN, value),
  /** 删除token */
  rm: () => window.localStorage.removeItem(STORAGE.TOKEN),
};

/**
 * 字符串换行符替换成<br />
 */
export const transferString = (content: string) => {
  return content.replace(/(\r\n|\n)/g, '<br>');
};
