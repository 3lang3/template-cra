export default () => {
  //  微信登录流程
  const redirctUrl = `redirect=${window.encodeURIComponent(window.location.href)}`;
  window.location.href = `${process.env.REACT_APP_WECHAT_AUTH}?${redirctUrl}`;
  return null;
};
