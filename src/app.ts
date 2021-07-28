import { tokenHelper } from './utils/utils';

import '@/style/global.less';

// 开发环境注入token
if (process.env.NODE_ENV === 'development') {
  console.log('inject dev token: ', process.env.TOKEN);
  tokenHelper.set(process.env.TOKEN as string);
}

/**
 * 初始化数据
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  // const data = await fetchXXX();
  return {};
}
