'use strict';

module.exports = (sequelize, DataTypes) =>
  sequelize.define('User', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {
    classMethods: {
      associate (models) {
        models.User.hasMany(models.Session);
      }
    }
  });
