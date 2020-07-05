module.exports = (sequelize, DataTypes) => {
  const FoodCategory = sequelize.define(
    'food_category',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      parent: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      firstchild: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      secondchild: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      thirdchild: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      fourthchild: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      longword: {
        type: DataTypes.STRING(200),
        allowNull: true
      }
    },
    {
      timeStampls: true,
      paranoid: true
    }
  );
  FoodCategory.associate = function(models) {
    FoodCategory.hasMany(models.restaurant, { foreignKey: 'id' });
  };

  return FoodCategory;
};
