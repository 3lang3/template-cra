import { STORAGE } from '@/config/constant';

/** cookie获取 */
export const getCookie = (name: string) => {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  var rs = (arr = document.cookie.match(reg));
  if (rs) {
    return unescape(arr[2]);
  } else {
    return null;
  }
};

/** token 操作集 */
export const tokenHelper = {
  /** 获取token */
  get: () =>
    getCookie('token') || window.localStorage.getItem(STORAGE.TOKEN) || '',
  /** 设置token */
  set: (value: string) => window.localStorage.setItem(STORAGE.TOKEN, value),
  /** 删除token */
  rm: () => window.localStorage.removeItem(STORAGE.TOKEN),
};
