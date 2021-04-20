import { Suspense } from 'react';
import { renderRoutes } from 'react-router-config';
import { Router } from 'react-router-dom';
import routes from '@/utils/routesConfig';
import ErrorBoundary from '@/pages/Exception/ErrorBoundary';
import history from '@/utils/history';

export default () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>loading...</div>}>
        <Router history={history}>
          {renderRoutes(routes, { someProp: 'these extra props are optional' })}
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
};
