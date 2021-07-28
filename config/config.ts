import { defineConfig } from 'umi';
import routes from './routes';
import proxy from './proxy';

const { REACT_APP_ENV = 'dev' } = process.env;

export default defineConfig({
  routes,
  proxy: (proxy as any)[REACT_APP_ENV],
  nodeModulesTransform: {
    type: 'none',
  },
  request: false,
  extraPostCSSPlugins: [
    require('postcss-aspect-ratio-mini'),
    require('postcss-px-to-viewport')({
      viewportWidth: 750, // (Number) The width of the viewport.
      viewportHeight: 1334, // (Number) The height of the viewport.
      unitPrecision: 4, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw', // (String) Expected units.
      selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
      mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
    }),
  ],
  // fastRefresh: {},
  dynamicImport: {},
  webpack5: {},
  mfsu: {},
  define: {
    'process.env.SHOP_HOST': process.env.SHOP_HOST,
    'process.env.API_MAIN': process.env.API_MAIN,
    'process.env.API_HOUSEKEEP': process.env.API_HOUSEKEEP,
    'process.env.API_VIDEO': process.env.API_VIDEO,
    'process.env.API_NODE_SERVICE': process.env.API_NODE_SERVICE,
    'process.env.API_MSG': process.env.API_MSG,
    'process.env.STATIC_PATH': process.env.STATIC_PATH,
    'process.env.WECHAT_AUTH_PATH': process.env.WECHAT_AUTH_PATH,
    'process.env.TOKEN': process.env.TOKEN,
  },
});
