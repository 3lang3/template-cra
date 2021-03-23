import { renderRoutes } from 'react-router-config';

export default ({ route }) => {
  // eslint-disable-next-line no-console
  console.log('render root');
  return renderRoutes(route.routes);
};
