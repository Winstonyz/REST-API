/**
 * code reference: course material rest_api_final/models/user.js
 */
 'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A firstName is required'
        },
        notEmpty: {
          msg: 'Please provide a firstName'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A lastName is required'
        },
        notEmpty: {
          msg: 'Please provide a lastName'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A emailAddress is required'
        },
        notEmpty: {
          msg: 'Please provide a emailAddress'
        }
      }
    },
    password: {
      type: DataTypes.STRING,  
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        }
      }
    }
  }, { sequelize });

  //In the Users model, add a one-to-many association between the User and Course models using the hasMany() method.
  //code reference: course material data_relationships_final/db/models/person.js
  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return User;
};