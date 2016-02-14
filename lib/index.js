'use strict';

const koa = require('koa');

const routers = require('./routers');

const app = koa();

app.use(routers.routes());

module.exports = app;
