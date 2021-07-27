import { STORAGE } from '@/config/constant';

/** token 操作集 */
export const tokenHelper = {
  /** 获取token */
  get: () => window.localStorage.getItem(STORAGE.TOKEN) || '',
  /** 设置token */
  set: (value: string) => window.localStorage.setItem(STORAGE.TOKEN, value),
  /** 删除token */
  rm: () => window.localStorage.removeItem(STORAGE.TOKEN),
};
