const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../models/index');

module.exports = {
  get: (req, res) => {
    let query =
      'select firstchild from food_categories      ' +
      "where firstchild not like '%null%'          " +
      'group by firstchild                         ';
    sequelize
      .query(query, {
        type: QueryTypes.SELECT
      })
      .then(result => {
        result = result.map(result => {
          return result.firstchild;
        });
        res.send(result);
      })
      .catch(err => {
        console.log(err);
        res.send('fdcategory error');
      })
      .catch(result => {
        res.status(500);
        res.send('잘못된 접근입니다.');
      });
  }
};
