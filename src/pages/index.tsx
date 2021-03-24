import { Suspense } from 'react';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import routes from '@/utils/routesConfig';
import ErrorBoundary from '@/pages/Exception/ErrorBoundary';

export default () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>loading...</div>}>
        <BrowserRouter>
          {renderRoutes(routes, { someProp: 'these extra props are optional' })}
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  );
};
