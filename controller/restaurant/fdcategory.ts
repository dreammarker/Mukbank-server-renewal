import { QueryTypes } from 'sequelize';
const { sequelize } = require('../../models/index');
import express from 'express'
export = {
  get: (req:express.Request, res:express.Response) => {
    let query =
      'select firstchild from food_categories      ' +
      "where firstchild not like '%null%'          " +
      'group by firstchild                         ';
    sequelize
      .query(query, {
        type: QueryTypes.SELECT
      })
      .then((result:any) => {
        result = result.map((result:any) => {
          return result.firstchild;
        });
        res.send(result);
      })
      .catch((err:any) => {
        console.log(err);
        res.send('fdcategory error');
      })
      .catch((result:any) => {
        res.status(500);
        res.send('잘못된 접근입니다.');
      });
  }
};
