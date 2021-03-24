// import 'react-app-polyfill/ie9';
// import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './utils/reportWebVitals';
import './style/global.less';
import pages from './pages';
import { GlobalProvider } from './state/global';

ReactDOM.render(
  <React.StrictMode>
    <GlobalProvider>{pages()}</GlobalProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
