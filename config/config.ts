import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { defineConfig } from 'umi';
import routes from './routes';
import proxy from './proxy';

const myEnv = dotenv.config();
dotenvExpand(myEnv);

const { REACT_APP_ENV = 'dev', NODE_ENV } = process.env;

export default defineConfig({
  hash: NODE_ENV === 'production',
  base: '/new/',
  publicPath: '/new/',
  routes,
  proxy: (proxy as any)[REACT_APP_ENV],
  nodeModulesTransform: {
    type: 'none',
  },
  request: false,
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'react-vant',
        libraryDirectory: 'es',
      },
    ],
  ],
  extraPostCSSPlugins: [
    require('postcss-aspect-ratio-mini'),
    require('postcss-px-to-viewport')({
      viewportWidth: 750, // (Number) The width of the viewport.
      viewportHeight: 1334, // (Number) The height of the viewport.
      unitPrecision: 4, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw', // (String) Expected units.
      selectorBlackList: [
        '.ignore',
        '.rv-dropdown-menu__title::after',
        /hairline/,
      ], // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
      mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
    }),
  ],
  favicon: NODE_ENV === 'production' ? '/new/logo' : '/logo.png',
  fastRefresh: {},
  dynamicImport: {
    loading: '@/components/Chore/DynamicImportLoader',
  },
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
    'process.env.PROXY_ENV': process.env.PROXY_ENV || 'dev',
  },
});
