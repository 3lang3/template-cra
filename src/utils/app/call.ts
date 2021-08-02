/**
 * app唤端
 * @see https://github.com/suanmei/callapp-lib
 */

import config from '@/config';
import { BROWSER_ENV } from '@/config/ua';
import CallApp from 'callapp-lib';
import type { CallappOptions } from 'callapp-lib/dist/type/types';

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
  fallback: `${config.shop}/new/download`,
};

const callApp = new CallApp(options);

/**
 * 唤端事件MAP
 *
 * 唤端事件请在此处进行抹平，解放业务层
 */
export const callAppMap = {
  /** 唤起app商详页 */
  goodsDetail: (param: {
    /** 商品ids */
    goods_ids: string | number;
    /** 商品item_id */
    item_id: string;
    /** 商品详情返回的page_type值 */
    page_type: string | number;
  }) => {
    if (BROWSER_ENV.IOS) {
      callApp.open({
        path: 'opencontroller ',
        param: {
          controller: 'XSGoodsDetailViewController',
          ...param,
        },
      });
    }
    if (BROWSER_ENV.ANDROID) {
      callApp.open({
        path: 'app:8888/goodsdetail/GoodsDetailActivity',
        param: {
          mGoodsIds: param.goods_ids,
          mItemId: param.item_id,
          mPageType: param.page_type,
        },
      });
    }
  },
};
