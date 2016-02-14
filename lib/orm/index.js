'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const Sequelize = require('sequelize');

const logger = require('../services/logger');

const config = require('../../config');

const sequelize = new Sequelize(config.DB_URL, {
  logging: logger.info,
  native: true
});

const modelRgx = /.*.js$/;

fs.readdirSync(__dirname)
  .filter(file => file !== path.basename(__filename) && modelRgx.test(file))
  .map(file => sequelize.import(`./${ file }`));

_.map(sequelize.models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(sequelize.models));

module.exports = sequelize;
