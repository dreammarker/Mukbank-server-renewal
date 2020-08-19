require('dotenv').config();
const { sequelize } = require('../../models/index');
import { QueryTypes } from 'sequelize';
import express from 'express'
export = {
  post: (req:express.Request, res:express.Response) => {
    try {
      let rest_id = req.body.rest_id;
      let query:string =
        'SELECT rest_id, count(rest_id) as count FROM user_likes where rest_id = ' +
        rest_id +
        ' AND likecheck = 1 group by rest_id';
      rest_id;
      sequelize
        .query(query, {
          type: QueryTypes.SELECT
        })
        .then((result:any) => {
          if (result) {
            res.send(result[0]);
          } else {
            res.send(false);
          }
        })
        .catch((err:any) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
      res.send('failed');
    }
  }
};
