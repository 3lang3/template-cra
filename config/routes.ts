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
    title: '生活服务',
    path: '/life',
    component: '@/pages/Life',
  },
] as IRoute[];
