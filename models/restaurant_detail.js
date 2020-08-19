'use strict';
module.exports = (sequelize, DataTypes) => {
  const restaurant_detail = sequelize.define(
    'restaurant_detail',
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      roadAddress: DataTypes.STRING,
      clock: DataTypes.STRING,
      restdetail: DataTypes.STRING,
      image: DataTypes.STRING,
      menuImage: DataTypes.STRING,
      option: DataTypes.STRING,
      menu: DataTypes.STRING,
      category: DataTypes.STRING,
      rest_id: { type: DataTypes.INTEGER, foreignKey: true }
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  restaurant_detail.associate = function(models) {
    // associations can be defined here
    restaurant_detail.belongsTo(models.restaurant, { foreignKey: 'rest_id' });
  };
  return restaurant_detail;
};
