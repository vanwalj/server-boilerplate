'use strict';

const Chance = require('chance');
const request = require('supertest');
const bcrypt = require('bcrypt');

const chance = new Chance();
const app = require('../services/app');
const orm = require('../services/orm');

describe('create session', () => {
  beforeEach(() => orm.sync({ force: true }));

  it('should create a session', () => {
    const email = chance.email();
    const password = chance.string();

    return orm.models.User.create({
      email, password: bcrypt.hashSync(password, 10)
    })
      .then(() =>
          request(app)
            .post('/sessions')
            .auth(email, password)
            .send()
            .expect(201)
      );
  });
});
