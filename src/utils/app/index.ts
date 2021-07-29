/**
 * app webview交互
 */
import { Dialog } from 'react-vant';
import { eventMap } from './events';
export { APP_INJECT_EVENT_MAP } from './events';
import call from './call';

/** 注入到全局的方法，app调用 */
const injectMethodToApp = (injectMethodName: string, func: Function) => {
  (window as any)[injectMethodName] = func;
};

/** 调用app的方法 */
export const runAppMethod = (methodName: string, options?: any) => {
  let method;
  if (window.android && window.android[methodName]) {
    // 传递给安卓方法的参数须stringify
    if (options) {
      options = typeof options === 'object' ? JSON.stringify(options) : options;
    }
    method = window.android[methodName];
  }
  if (window.webkit && window.webkit.messageHandlers[methodName]) {
    method = window.webkit.messageHandlers[methodName].postMessage;
  }

  try {
    return method(options);
  } catch (error) {
    console.log(error);
    Dialog.alert({
      title: '提示',
      message: '当前版本不支持该功能，请更新app后再来哦～',
    });
  }
};

type AppHelper = {
  /** 注入到全局的方法，方便app调用 */
  inject: (injectMethodName: string, func: any) => void;
  /** 调用app的方法 */
  run: (methodName: string, options: any) => void;
  /** 调用app事件 */
  event: typeof eventMap;
  /** 唤起app */
  call: typeof call;
};

const app: AppHelper = {
  inject: injectMethodToApp,
  run: runAppMethod,
  event: eventMap,
  call,
};

export default app;
