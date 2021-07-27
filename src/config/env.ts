export default {
  SHOP_HOST: process.env.SHOP_HOST,
  API_MAIN: process.env.API_MAIN,
  API_HOUSEKEEP: process.env.API_HOUSEKEEP,
  API_VIDEO: process.env.API_VIDEO,
  API_NODE_SERVICE: process.env.API_NODE_SERVICE,
  API_MSG: process.env.API_MSG,
  STATIC_PATH: process.env.STATIC_PATH,
  WECHAT_AUTH_PATH: process.env.WECHAT_AUTH_PATH,
} as Record<string, string>;
