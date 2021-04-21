import { getRedirectUrl } from '..';

export default () => {
  // 微信登录流程
  const redirctUrl = `redirect=${getRedirectUrl()}`;
  window.location.href = `${process.env.REACT_APP_WECHAT_AUTH}?${redirctUrl}`;
  return null;
};
