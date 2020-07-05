//* 관계 n 테이블
'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserLocationSta = sequelize.define(
    'user_location_statics',
    {
      count: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      location: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        foreignKey: true
      }
    },

    {
      timeStapms: true,
      paranoid: true
    }
  );

  UserLocationSta.associate = function(model) {
    UserLocationSta.belongsTo(model.user, { foreignKey: 'user_id' });
  };

  return UserLocationSta;
};
