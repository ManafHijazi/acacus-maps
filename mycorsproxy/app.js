const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(
  '/',
  createProxyMiddleware({
    target: 'https://beta-lynxapis-tracking.azurewebsites.net',
    changeOrigin: true,
    onProxyres: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
  }),
);

app.listen(9000);
