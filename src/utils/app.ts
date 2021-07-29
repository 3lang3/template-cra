import { Dialog } from 'react-vant';

export const APP_METHOD_MAP = {
  /**
   * 获取app webview下的token
   * @summary 只有安卓生效, ios会主动调用setToken方法注入token
   * */
  GET_TOKEN: 'getToken',
};

const injectMethodToApp = (injectMethodName: string, func: Function) => {
  (window as any)[injectMethodName] = func;
};

const runAppMethod = (methodName: string, ...options: any[]) => {
  let args = options;

  let method;
  if (window.android && window.android[methodName]) {
    // 传递给安卓方法的参数须stringify
    if (options.length) {
      args = options.map((el) =>
        typeof el === 'object' ? JSON.stringify(el) : el,
      );
    }
    method = window.android[methodName];
  }
  if (window.webkit && window.webkit.messageHandlers[methodName]) {
    method = window.webkit.messageHandlers[methodName].postMessage;
  }

  try {
    return method(...args);
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
  run: (methodName: string) => void;
};

const appHelper: AppHelper = {
  inject: injectMethodToApp,
  run: runAppMethod,
};

export default appHelper;
