//* 다대다 테이블
module.exports = (sequelize, DataTypes) => {
  const UserSelectRest = sequelize.define(
    'user_select_rest',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      count: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true
      },
      rest_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false
      }
    },

    {
      timeStamps: true,
      paranoid: true
    }
  );

  UserSelectRest.associate = function(models) {
    UserSelectRest.belongsTo(models.user, { foreignKey: 'user_id' });
    UserSelectRest.belongsTo(models.restaurant, { foreignKey: 'rest_id' });
  };

  return UserSelectRest;
};
