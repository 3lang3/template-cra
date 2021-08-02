import { IRoute } from 'umi';

export default [
  { path: '/', component: '@/pages/Home' },
  {
    path: '/profile',
    wrappers: ['@/wrappers/auth'],
    component: '@/pages/Profile',
  },
  { title: '登录', path: '/login', component: '@/pages/Login' },
  {
    title: '商品分享',
    path: '/share/product',
    component: '@/pages/Share/Product',
  },
  {
    title: 'APP下载',
    path: '/download',
    component: '@/pages/Download',
  },
  {
    title: '本地生活',
    path: '/local-life',
    component: '@/pages/LocalLife',
  },
  {
    title: '美团团购券',
    path: '/group-buy',
    component: '@/pages/GroupBuy',
  },
  {
    title: '美团团购券搜索',
    path: '/group-buy-search',
    component: '@/pages/GroupBuy/search',
  },
] as IRoute[];
