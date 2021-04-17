import { browser } from 'utilbag';
import LoginMobile from './component/LoginMobile';
import LoginWebview from './component/LoginWebview';
import LoginWechat from './component/LoginWechat';
import LoginWeb from './component/LoginWeb';

/**
 * 登录逻辑分发
 */
export default () => {
  if (browser.isWechatBrowser()) {
    // 微信h5 登录
    return <LoginWechat />;
  }
  if (browser.isWebview()) {
    // app嵌入 登录
    return <LoginWebview />;
  }
  if (browser.isMobileBrowser()) {
    // 移动端 登录
    return <LoginMobile />;
  }
  return <LoginWeb />;
};
