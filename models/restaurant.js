'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define(
    'restaurant',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(250),
        allowNull: false
      },

      phone: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      address: {
        type: DataTypes.STRING(250),
        allowNull: true
      },

      roadAddress: {
        type: DataTypes.STRING(250),
        allowNull: true
      },

      image: {
        type: DataTypes.STRING(250),
        allowNull: true
      },

      reviewsort: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      xmap: {
        type: DataTypes.STRING(250),
        allowNull: true
      },

      ymap: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      latitude: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      longitude: {
        type: DataTypes.STRING(250),
        allowNull: true
      },
      fd_category_id: {
        type: DataTypes.INTEGER,
        foreignKey: true
      }
    },
    {
      timeStamps: true,
      paranoid: true
    }
  );
  Restaurant.associate = function(models) {
    Restaurant.hasMany(models.user_select_rest, { foreignKey: 'rest_id' });
    Restaurant.hasMany(models.user_review, { foreignKey: 'rest_id' });
    Restaurant.belongsTo(models.food_category, {
      foreignKey: 'fd_category_id'
    });
    Restaurant.hasMany(models.user_like, { foreignKey: 'rest_id' });
  };
  return Restaurant;
};
