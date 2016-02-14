'use strict';

module.exports = (sequelize, DataTypes) =>
  sequelize.define('Session', {
    token: { type: DataTypes.STRING, allowNull: false }
  }, {
    classMethods: {
      associate (models) {
        models.Session.belongsTo(models.User);
      }
    }
  });
