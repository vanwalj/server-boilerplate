'use strict';

const http = require('http');

const app = require('../../index');

module.exports = http.createServer(app.callback());
