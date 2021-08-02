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
    path: '/a', // app嵌入
    routes: [
      {
        title: '订单认领',
        path: 'order/claim',
        component: '@/pages/App/Order/Claim',
      },
      {
        title: '订单认领',
        path: 'order/claim/result',
        component: '@/pages/App/Order/Claim/Result',
      },
    ],
  },
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
    title: '本地生活',
    path: '/group-buy',
    component: '@/pages/GroupBuy',
  },
  {
    title: '搜索',
    path: '/group-buy-search',
    component: '@/pages/GroupBuy/search',
  },
] as IRoute[];
