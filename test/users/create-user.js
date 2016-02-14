'use strict';

const Chance = require('chance');
const request = require('supertest');
const bcrypt = require('bcrypt');

const chance = new Chance();
const app = require('../services/app');
const orm = require('../services/orm');

describe('create user', () => {
  beforeEach(() => orm.sync({ force: true }));

  it('should create a user', () =>
    request(app)
      .post('/users')
      .send({
        email: chance.email(),
        password: chance.string()
      })
      .expect(201)
  );

  it('should try to create a duplicated user', () => {
    const email = chance.email();
    const password = chance.string();

    return orm.models.User.create({
      email, password: bcrypt.hashSync(password, 10)
    })
    .then(() =>
      request(app)
        .post('/users')
        .send({ email, password })
        .expect(409)
    );
  });
});
