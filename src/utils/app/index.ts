/**
 * app webview交互
 */

import { Dialog } from 'react-vant';
import { eventMap } from './events';
import { callAppMap } from './call';
import { BROWSER_ENV } from '@/config/ua';

export { APP_INJECT_EVENT_MAP } from './events';

/** 注入到全局的方法，app调用 */
const injectMethodToApp: <P = unknown, R = unknown>(
  injectMethodName: string,
  injectMethod: (params: P) => R,
) => any = (injectMethodName, func) => {
  (window as any)[injectMethodName] = func;
};

/** 调用app的方法 */
export const runAppMethod = <T = unknown>(
  methodName: string,
  options?: any,
): T | undefined => {
  if (BROWSER_ENV.WEBVIEW) {
    let opts;
    try {
      if (window.android && window.android[methodName]) {
        // 传递给安卓方法的参数须stringify
        if (options) {
          opts =
            typeof options === 'object' ? JSON.stringify(options) : options;
        }
        return opts
          ? window.android[methodName](opts)
          : window.android[methodName]();
      }
      if (window.webkit && window.webkit.messageHandlers[methodName]) {
        return window.webkit.messageHandlers[methodName].postMessage(options);
      }
    } catch (error) {
      Dialog.alert({
        title: '提示',
        message: `当前版本不支持该功能，请更新app后再来哦～`,
      });
    }
  }
  return undefined;
};

const app = {
  inject: injectMethodToApp,
  event: eventMap,
  call: callAppMap,
};

export default app;
