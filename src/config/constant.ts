/** .env注入变量 */
export const ENVVAR = {
  SHOP_HOST: process.env.SHOP_HOST,
  API_MAIN: process.env.API_MAIN,
  API_HOUSEKEEP: process.env.API_HOUSEKEEP,
  API_VIDEO: process.env.API_VIDEO,
  API_NODE_SERVICE: process.env.API_NODE_SERVICE,
  API_MSG: process.env.API_MSG,
  STATIC_PATH: process.env.STATIC_PATH,
  WECHAT_AUTH_PATH: process.env.WECHAT_AUTH_PATH,
};

export const STORAGE = {
  /** 存储token的key */
  TOKEN: 'authorization',
};

/** 分页数据 */
export const PAGINATION = {
  DEFAULT: { page: 1, pageSize: 10, totalPage: 99 },
};
