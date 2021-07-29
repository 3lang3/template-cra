/**
 * 浏览器user-agent相关
 */

export const ua = window.navigator.userAgent.toLowerCase();

const BROWSER_ENV_WECHAT = ua.indexOf('micromessenger') > -1;
const BROWSER_ENV_WORK_WECHAT = BROWSER_ENV_WECHAT && ua.indexOf('wxwork') > -1;
const BROWSER_ENV_IOS = ua.match(/(iPhone|iPod|iPad);?/i);
const BROWSER_ENV_ANDROID = ua.match(/android/i);
const BROWSER_ENV_WEBVIEW =
  (typeof window.webkit !== 'undefined' ||
    typeof window.android !== 'undefined') &&
  !BROWSER_ENV_WECHAT;

export const BROWSER_ENV = {
  /** 微信浏览器中 */
  WECHAT: BROWSER_ENV_WECHAT,
  /** 企业微信 */
  WORK_WECHAT: BROWSER_ENV_WORK_WECHAT,
  /** 安卓webview */
  ANDROID: BROWSER_ENV_ANDROID,
  /** ios webview */
  IOS: BROWSER_ENV_IOS,
  /** webview环境 (排除微信) */
  WEBVIEW: BROWSER_ENV_WEBVIEW,
};
