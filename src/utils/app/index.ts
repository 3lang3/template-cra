/**
 * app webview交互
 */

import { Dialog } from 'react-vant';
import { eventMap } from './events';
import { callAppMap } from './call';

export { APP_INJECT_EVENT_MAP } from './events';

/** 注入到全局的方法，app调用 */
const injectMethodToApp = (injectMethodName: string, func: () => void) => {
  (window as any)[injectMethodName] = func;
};

/** 调用app的方法 */
export const runAppMethod = <T = undefined>(
  methodName: string,
  options?: any,
): T => {
  let opts = options as any;
  let method;
  if (window.android && window.android[methodName]) {
    // 传递给安卓方法的参数须stringify
    if (options) {
      opts = typeof options === 'object' ? JSON.stringify(opts) : opts;
    }
    method = window.android[methodName];
  }
  if (window.webkit && window.webkit.messageHandlers[methodName]) {
    method = window.webkit.messageHandlers[methodName].postMessage;
  }

  try {
    return method(opts);
  } catch (error) {
    Dialog.alert({
      title: '提示',
      message: '当前版本不支持该功能，请更新app后再来哦～',
    });
  }
  return (undefined as unknown) as T;
};

type AppHelper = {
  /** 注入到全局的方法，方便app调用 */
  inject: (injectMethodName: string, func: any) => void;
  /** 调用app的方法 */
  run: (methodName: string, options: any) => void;
  /** 调用app事件 */
  event: typeof eventMap;
  /** 唤起app */
  call: typeof callAppMap;
};

const app: AppHelper = {
  inject: injectMethodToApp,
  run: runAppMethod,
  event: eventMap,
  call: callAppMap,
};

export default app;
