import { Redirect } from 'react-router-dom';
import { getCurrentUser } from '@/services/global';
import { renderRoutes } from 'react-router-config';
import history from '@/utils/history';
import { getToken } from '@/utils/utils';
import { memo, useEffect } from 'react';
import { userUpgrade } from '@/state/global';
import { Toast, Modal } from '@/components';

const loginPath = '/login';

/**
 * app获取初始化数据
 */
async function getInitialState(): Promise<{
  fetchUserInfo: () => Promise<any>;
  currentUser: Record<string, any>;
}> {
  const fetchUserInfo = async () => {
    try {
      const { data, type, msg } = await getCurrentUser();
      if (type === 1) throw Error(msg);
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('登录失败:', error);
    }
    return undefined;
  };
  const currentUser = await fetchUserInfo();
  return { fetchUserInfo, currentUser };
}

const InitialState = memo(
  () => {
    const upgrade = userUpgrade();
    const tk = getToken();
    const notLoginPath = history.location.pathname !== loginPath;
    useEffect(() => {
      if (tk) {
        getInfo();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getInfo() {
      try {
        const { currentUser } = await getInitialState();
        if (!currentUser) throw Error('getInitialState faild...');
        upgrade(currentUser as any);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('get user info error: ', error);
      }
    }

    if (!tk && notLoginPath)
      return (
        <Redirect to={{ pathname: loginPath, search: `?redirect=${history.location.pathname}` }} />
      );
    return null;
  },
  () => true,
);

/**
 * 每次路由变动触发root render
 */
export default ({ route }) => {
  useEffect(() => {
    // 页面切换 销毁非root包裹组件
    Modal.destroy();
    Toast.destroy();
  });
  return (
    <>
      <InitialState />
      {renderRoutes(route.routes)}
    </>
  );
};
