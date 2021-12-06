/**
 * code reference: course material rest_api_final/models/user.js
 */
 'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title is required'
        },
        notEmpty: {
          msg: 'Please provide a title'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A description is required'
        },
        notEmpty: {
          msg: 'Please provide a description'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, { sequelize });

  //In the Courses model, add a one-to-one association between the Course and User models using the belongsTo() method.
  //code reference: course material data_relationships_final/db/models/person.js

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return Course;
};