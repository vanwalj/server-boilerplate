'use strict';

const Promise = require('bluebird');
const compose = require('koa-compose');
const validator = require('koa-joi-validator');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

const orm = require('../../orm');

module.exports.path = '/';
module.exports.method = 'post';

module.exports.handler = compose([
  validator.validate({
    type: 'json',
    body: {
      email: validator.Joi.string().email().required(),
      password: validator.Joi.string().required()
    }
  }),
  function * createUser () {
    const password = yield bcrypt.hashAsync(this.request.body.password, 10);

    const user = yield orm.models.User.create({
      email: this.request.body.email,
      password
    })
      .catch(orm.UniqueConstraintError, () => {
        this.throw(409, 'Email already registered');
      });

    this.status = 201;
    this.body = user.toJSON();
  }
]);
