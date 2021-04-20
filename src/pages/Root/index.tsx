import { Redirect } from 'react-router-dom';
import { getCurrentUser } from '@/services/global';
import { renderRoutes } from 'react-router-config';
import history from '@/utils/history';
import { getToken } from '@/utils/utils';
import { useEffect } from 'react';
import { userUpgrade } from '@/state/global';

const loginPath = '/login';

async function getInitialState(): Promise<{
  fetchUserInfo: () => Promise<any>;
  currentUser?: Record<string, any>;
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
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return { fetchUserInfo, currentUser };
  }
  return { fetchUserInfo };
}

const GetUserInfo = () => {
  const upgrade = userUpgrade();
  const tk = getToken();
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

  if (!tk && history.location.pathname !== loginPath)
    return <Redirect to={{ pathname: loginPath }} />;
  return null;
};

/**
 * 每次路由变动都会rerender
 */
export default ({ route }) => {
  // eslint-disable-next-line no-console
  console.log('render root');
  return (
    <>
      <GetUserInfo />
      {renderRoutes(route.routes)}
    </>
  );
};
