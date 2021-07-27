import { tokenHelper } from './utils/utils';

import '@/style/theme.less';

if (process.env.NODE_ENV === 'development') {
  console.log('inject dev token: ', process.env.TOKEN);
  tokenHelper.set(process.env.TOKEN as string);
}
