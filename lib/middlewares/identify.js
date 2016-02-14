'use strict';

const base64 = require('base-64');
const Promise = require('bluebird');
const compose = require('koa-compose');
const authHeaderParser = require('koa-auth-header-parser');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const orm = require('../orm');

const basicAuthReg = /(.*):(.*)/;

module.exports = () => compose([
  authHeaderParser(),
  function * identify (next) {
    if (this.state.authType === 'Basic' && this.state.authToken) {
      let decodedAuthToken;
      try {
        decodedAuthToken = base64.decode(this.state.authToken);
      } catch (e) {
        this.throw(e, 401);
      }

      const match = decodedAuthToken.match(basicAuthReg);
      this.assert(match && match.length === 3, 401);

      const user = yield orm.models.User.findOne({
        where: { email: match[1] }
      });
      this.assert(user, 401);
      this.assert(yield bcrypt.compareAsync(match[2], user.password), 401);

      this.state.user = user;
    }

    if (this.state.authType === 'Bearer' && this.state.authToken) {
      this.state.session = yield orm.models.Session.findOne({
        where: { token: this.state.authToken }
      });
      this.assert(this.state.session, 401);

      this.state.user = yield this.state.session.getUser();
      this.assert(this.state.user, 401);
    }

    yield next;
  }
]);
