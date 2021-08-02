import { STORAGE } from './config/constant';
import { BROWSER_ENV } from './config/ua';
import { getCurrentUser } from './services/common';
import app, { APP_INJECT_EVENT_MAP } from './utils/app';
import { tokenHelper } from './utils/utils';

// 开发环境注入token
if (process.env.NODE_ENV === 'development' && process.env.TOKEN) {
  // eslint-disable-next-line no-console
  console.log('.env.local file TOKEN has been injectd!');
  tokenHelper.set(process.env.TOKEN as string);
}

// app调用事件注入
if (BROWSER_ENV.WEBVIEW) {
  app.inject(APP_INJECT_EVENT_MAP.APP_VERSION, (str: string) =>
    window.localStorage.setItem(STORAGE.APP_VERSION, str),
  );
  app.inject(APP_INJECT_EVENT_MAP.SET_LOCATION, (str: string) =>
    window.localStorage.setItem(STORAGE.APP_LOCATION, str),
  );
  app.inject(APP_INJECT_EVENT_MAP.SET_TOKEN, tokenHelper.set);
}

/**
 * 初始化数据
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  const localToken = tokenHelper.get();
  if (!localToken) return undefined;
  try {
    const { data, type, msg } = await getCurrentUser();
    if (type === 1) throw new Error(msg);
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return undefined;
}
