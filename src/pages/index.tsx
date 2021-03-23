import { Suspense } from 'react';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import routes from '@/utils/routes';

export default () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </Suspense>
  );
};
