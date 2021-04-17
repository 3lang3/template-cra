import { renderRoutes } from 'react-router-config';

/**
 * 每次路由变动都会rerender
 */
export default ({ route }) => {
  // eslint-disable-next-line no-console
  console.log('render root');
  return renderRoutes(route.routes);
};
