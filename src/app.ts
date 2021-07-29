import { getCurrentUser } from './services/global';
import { tokenHelper } from './utils/utils';

// 开发环境注入token
if (process.env.NODE_ENV === 'development' && process.env.TOKEN) {
  console.log('inject dev token: ', process.env.TOKEN);
  tokenHelper.set(process.env.TOKEN as string);
}

/**
 * 初始化数据
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  const localToken = tokenHelper.get();
  if (!localToken) return {};
  try {
    const { data, type, msg } = await getCurrentUser();
    if (type === 1) throw new Error(msg);
    return data;
  } catch (error) {
    console.log(error);
  }
  return {};
}
