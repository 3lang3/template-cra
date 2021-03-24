import type { RouteItem } from './utils/routesUtil';

export default [
  {
    component: 'Root',
    routes: [
      {
        path: '/',
        component: 'Home',
        exact: true,
      },
      {
        path: '/user/:id',
        component: 'User',
      },
      {
        path: '/login',
        component: 'Login',
        exact: true,
      },
      {
        path: '/login',
        component: 'Login',
        exact: true,
      },
      {
        component: 'Exception/404',
      },
    ],
  },
] as RouteItem[];
