const jwt = require('jsonwebtoken');
// const { user } = require('../../models');
require('dotenv').config();
const { sequelize } = require('../../models/index');
const { QueryTypes } = require('sequelize');

module.exports = {
  post: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const userobj = jwt.verify(token, process.env.JWT_KEY).data;
      let parent = req.body.parent;
      if (!parent) {
        parent = '음식점';
      }
      if (userobj.id) {
        let query =
          ' SELECT user_id,rest_id, name,latitude,longitude,fd.parent as parent ,likecheck, rest.image ,fd.firstchild as firstchild, fd.secondchild as secondchild , rest.address as address   ';
        query += ' FROM mukbank.user_likes as likes ';
        query += ' join restaurants as rest on likes.rest_id = rest.id ';
        query += ' join food_categories as fd on rest.fd_category_id = fd.id';
        query += ' where likes.user_id=' + userobj.id;
        query += ' and parent = ' + "'" + parent + "'";
        query += ' and likes.likecheck=true';

        let likedata = await sequelize
          .query(query, {
            type: QueryTypes.SELECT
          })
          .catch(result => {
            res.status(500);
            res.send('잘못된 접근입니다.');
          });

        res.send(likedata);
      } else {
        console.log('wrong');
        res.status(400).send('wrong');
      }
    } catch (err) {
      console.log(err);
      res.send('failed');
    }
  }
};
