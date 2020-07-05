const { restaurant_detail } = require('../../models');

module.exports = {
  //식당정보 및 카페정보 보여주기 식당정보는 사용자가 싫어하는 분류를 필터해서 보여줄수 있다.
  post: async (req, res) => {
    let rest_id = req.body.rest_id;
    try {
      restaurant_detail
        .findOne({
          where: {
            rest_id: rest_id
          }
        })
        .then(result => {
          res.send(result);
        })
        .catch(err => {
          console.log(err);
          res.end('restdeatil.sql error');
        });
    } catch {
      res.send('error');
    }
  }
};
