const { createProxyMiddleware } = require('http-proxy-middleware');

const HOST = process.env.REACT_APP_VAR_HOST;
const ENV_PREFIX = process.env.REACT_APP_PROXY_ENV;

// eslint-disable-next-line func-names
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `https://${ENV_PREFIX}shopapi.${HOST}`,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '',
      },
    }),
  );
};
