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
 * 登录逻辑分发
 */
export default () => {
  const tk = getToken();
  useEffect(() => {
    if (tk) {
      const { redirect } = parse(history.location.search.substr(1));
      history.replace(redirect || '/');
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
