import { useModel, history } from 'umi';
import { Button, Dialog } from 'react-vant';
import styles from './index.less';
import { BROWSER_ENV } from '@/config/ua';
import config from '@/config';
import { useEffect } from 'react';

/** 微信授权 */
const WechatLoginComp = () => {
  useEffect(() => {
    const redirctUrl = `redirect=${window.encodeURIComponent(
      window.location.hostname,
    )}`;
    window.location.href = `${config.wechatAuth}?${redirctUrl}`;
  }, []);
  return null;
};

const MobileLoginComp = () => {
  const { signin } = useModel('user', (model) => ({
    signin: model.signin,
  }));

  const login = async () => {
    // 手动登录逻辑
    await signin();
    history.goBack();
  };

  return (
    <div>
      <h1 className={styles.title}>Login page</h1>
      <Button color="#3f45ff" square block onClick={() => login()}>
        登 录
      </Button>
    </div>
  );
};

export default () => {
  const { user } = useModel('user', (model) => ({
    user: model.user,
  }));

  useEffect(() => {
    // 已登录用户
    if (user) {
      const fallback = async () => {
        await Dialog.alert({ title: '提示', message: '您已经登录啦' });
        history.goBack();
      };
      fallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user) return null;
  if (BROWSER_ENV.WECHAT) return <WechatLoginComp />;
  return <MobileLoginComp />;
};
