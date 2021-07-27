import url from './env';

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
};

export default config;
