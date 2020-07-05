//* 관계 n 테이블
'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAgeSta = sequelize.define(
    'user_age_statics',
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
      timeStamps: true,
      paranoid: true
    }
  );

  UserAgeSta.associate = function(model) {
    UserAgeSta.belongsTo(model.user, { foreignKey: 'user_id' });
  };

  return UserAgeSta;
};
