export const ua = window.navigator.userAgent.toLowerCase();

const BROWSER_ENV_WECHAT = ua.indexOf('micromessenger') > -1;
const BROWSER_ENV_WORK_WECHAT = BROWSER_ENV_WECHAT && ua.indexOf('wxwork') > -1;

/** 运行环境 */
export const BROWSER_ENV = {
  /** 微信浏览器中 */
  WECHAT: BROWSER_ENV_WECHAT,
  /** 企业微信 */
  WORK_WECHAT: BROWSER_ENV_WORK_WECHAT,
  /** 安卓webview */
  ANDROID: ua.match(/android/i),
  /** ios webview */
  IOS: ua.match(/(iPhone|iPod|iPad);?/i),
};
