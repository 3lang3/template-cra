/* eslint-disable no-param-reassign */
import { lazy } from 'react';
import routes from '@/routes';

/**
 *
 * @param pagePath
 * @returns
 */
function loadPage(pagePath: string) {
  return lazy(() => import(`@/pages/${pagePath}`));
}

export type RouteItem = {
  path?: string;
  component: string;
  exact?: boolean;
  routes?: RouteItem[];
};

function flattenRoutes(routeArr: RouteItem[]) {
  return routeArr.map((el) => {
    if (el.routes) {
      el.routes = flattenRoutes(el.routes);
    }
    el.component = (loadPage(el.component) as unknown) as string;
    return el;
  });
}

export default flattenRoutes(routes);
