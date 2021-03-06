import { ENVVAR as url } from './constant';

const config = {
  api: {
    main: url.API_MAIN,
    housekeep: url.API_HOUSEKEEP,
    msg: url.API_MSG,
    node: url.API_NODE_SERVICE,
    video: url.API_VIDEO,
  },
  cdn: url.STATIC_PATH,
  shop: url.SHOP_HOST,
  wechatAuth: url.WECHAT_AUTH_PATH,
};

export default config;
