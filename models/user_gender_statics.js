//* 관계 n 테이블
'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserGenderSta = sequelize.define(
    'user_gender_statics',
    {
      count: {
        type: DataTypes.INTEGER,
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

  UserGenderSta.associate = function(model) {
    UserGenderSta.belongsTo(model.user, { foreignKey: 'user_id' });
  };

  return UserGenderSta;
};
