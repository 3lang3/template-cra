import { browser } from 'utilbag';
import LoginMobile from './component/LoginMobile';
import LoginWebview from './component/LoginWebview';
import LoginWechat from './component/LoginWechat';
import LoginWeb from './component/LoginWeb';
import { getToken } from '@/utils/utils';
import history from '@/utils/history';
import { parse } from 'querystring';
import { useEffect } from 'react';

/**
 * 获取url中的redirect参数
 * @returns {string}
 */
export const getRedirectUrl = () => {
  const { redirect } = parse(history.location.search.substr(1)) as { redirect: string };
  return decodeURIComponent(redirect || '/');
};

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
export const goto = () => {
  const redirect = getRedirectUrl();
  window.location.href = redirect;
};

/**
 * 登录逻辑分发
 */
export default () => {
  const tk = getToken();
  useEffect(() => {
    if (tk) {
      goto();
    }
  }, [tk]);

  if (tk) return null;
  if (browser.isWechatBrowser()) {
    // 微信登录
    return <LoginWechat />;
  }
  if (browser.isWebview()) {
    // app webview登录
    return <LoginWebview />;
  }
  if (browser.isMobileBrowser()) {
    // 移动端登录
    return <LoginMobile />;
  }
  // web端登录
  return <LoginWeb />;
};
