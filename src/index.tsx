/**
 * 引入polyfill兼容es特性
 */
// import 'react-app-polyfill/ie9';
// import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './utils/reportWebVitals';
import pages from './pages';
import { GlobalProvider } from './state/global';
import { getCookie, setToken } from './utils/utils';
import './style/global.less';

// 开发环境直接写入token
if (process.env.NODE_ENV === 'development') {
  setToken(process.env.REACT_APP_TOKEN as string);
}

const cookieTk = getCookie('token');
if (cookieTk) setToken(cookieTk);

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
