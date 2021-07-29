/**
 * app唤端
 * @see https://github.com/suanmei/callapp-lib
 */

import config from '@/config';
import CallApp from 'callapp-lib';
import { CallappOptions } from 'callapp-lib/dist/type/types';

// andriod: xiusheng://app:8888/goodsdetail/GoodsDetailActivity?mGoodsIds={goodsIds}&mItemId={itemId}&mPageType={pageType}
// ios: xiusheng://opencontroller?controller=XSGoodsDetailViewController&goods_ids=123&page_type=123&item_id=123

const options: CallappOptions = {
  timeout: 2100,
  scheme: {
    protocol: 'xiusheng',
  },
  intent: {
    scheme: 'xiusheng',
    package: 'com.zhp.xiusheng',
  },
  appstore: 'https://apps.apple.com/cn/app/id1563146799',
  yingyongbao: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.zhp.xiusheng',
  fallback: `${config.shop}/share/download`,
};

const callApp = new CallApp(options);

export default callApp;
