/* eslint-disable no-param-reassign */
import { lazy } from 'react';

/**
 *
 * @param pagePath
 * @returns
 */
function loadPage(pagePath: string) {
  return lazy(() => import(`@/pages/${pagePath}`));
}

function flattenRoutes(routes: RouteItem[]) {
  return routes.map((el) => {
    if (el.routes) {
      el.routes = flattenRoutes(el.routes);
    }
    el.component = (loadPage(el.component) as unknown) as string;
    return el;
  });
}

type RouteItem = {
  path?: string;
  component: string;
  exact?: boolean;
  routes?: RouteItem[];
};

const routes = [
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
    ],
  },
] as RouteItem[];

export default flattenRoutes(routes);
