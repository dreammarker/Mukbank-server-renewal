//* 다대다 테이블
module.exports = (sequelize, DataTypes) => {
  const UserReview = sequelize.define(
    'user_review',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      message: {
        type: DataTypes.STRING(500),
        allowNull: true
      },

      score: {
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

  UserReview.associate = function(models) {
    UserReview.belongsTo(models.user, { foreignKey: 'user_id' });
    UserReview.belongsTo(models.restaurant, { foreignKey: 'rest_id' });
  };

  return UserReview;
};
