'use strict';

const compose = require('koa-compose');
const randToken = require('rand-token');

const identify = require('../../middlewares/identify');
const authenticate = require('../../middlewares/authenticate');

const orm = require('../../orm');

module.exports.path = '/';
module.exports.method = 'post';

module.exports.handler = compose([
  identify(),
  authenticate(),
  function * createSession () {
    const session = yield orm.models.Session.create({
      token: randToken.generate(32),
      UserId: this.state.user.id
    });

    this.status = 201;
    this.body = session.toJSON();
  }
]);
