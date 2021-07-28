import { IRoute } from 'umi';

export default [
  { path: '/', component: '@/pages/Home' },
  {
    path: '/profile',
    wrappers: ['@/wrappers/auth'],
    component: '@/pages/Profile',
  },
  { title: '登录', path: '/login', component: '@/pages/Login' },
] as IRoute[];
