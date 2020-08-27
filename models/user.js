'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING(250),
        allowNull: true
      },

      nick: {
        type: DataTypes.STRING(250),
        allowNull: true
      },

      snsId: {
        type: DataTypes.STRING(250),
        allowNull: true
      },

      provider: {
        type: DataTypes.STRING(250),
        allowNull: true
      },

      age: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },

      gender: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      userimage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password : {
        type : DataTypes.STRING
      },
      identity: {
        type : DataTypes.STRING
      }
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  User.associate = function(models) {
    //유저랑 age랑 1: n연결
    User.hasMany(models.user_age_statics, { foreignKey: 'user_id' });
    //유저랑 gender 1: n 연결
    User.hasMany(models.user_gender_statics, { foreignKey: 'user_id' });
    //유저랑 location 1:n 연결
    User.hasMany(models.user_location_statics, { foreignKey: 'user_id' });
    //유저랑 review select
    User.hasMany(models.user_review, { foreignKey: 'user_id' });
    //유저랑 user_review
    User.hasMany(models.user_select_rest, { foreignKey: 'user_id' });
    //유저랑 user_hate_food
    User.hasMany(models.user_hate_food, { foreignKey: 'user_id' });
    //유저랑 user_like
    User.hasMany(models.user_like, { foreignKey: 'user_id' });
  };

  return User;
};
