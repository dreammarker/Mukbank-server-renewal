const { user_hate_food } = require('../../models');
const jwt = require('jsonwebtoken');

function getKeyByValue(object:any, value:boolean|string) {
  return Object.keys(object).filter(key => object[key] === value);
}
import express from 'express';
export = {
  //user의 식당 데이터를 업데이트 및 insert 하는 작업
  post: async (req:express.Request, res:express.Response) => {
    // Obj {"일식": true, "한식": false, "중식":true}
    const hatefdObj:object = req.body.hatefd;

    // ture 인 키만 필터 ["일식","중식"]
    const filterTrueKey:Array<string> = getKeyByValue(hatefdObj, true);

    // ["일식","중식"]==> "일식,중식"
    let hatefd:string = '' + filterTrueKey;

    //토근을 가져온다.
    // let loginobj = req.cookies.loginobj;
    let token:any = req.headers
    token = token.authorization.split(' ')[1];

    //토근을 가지고
    let userobj = jwt.verify(token, process.env.JWT_KEY).data;
    let usercheck = await user_hate_food.findOne({
      where: {
        user_id: userobj.id
      }
    });
    //userhate table에 정보가 있다면 update
    if (usercheck) {
      user_hate_food.update(
        {
          fd_category: hatefd
        },
        {
          where: {
            user_id: userobj.id
          }
        }
      );
    }
    //없다면 insert ..
    else {
      user_hate_food.create({
        user_id: userobj.id,
        fd_category: hatefd
      });
    }
    res.send('sucees');
  },
  get: async (req:express.Request, res:express.Response) => {
    let token:any = req.headers
    token = token.authorization.split(' ')[1];

    //토근을 가지고
    let userobj = jwt.verify(token, process.env.JWT_KEY).data;
    let usercheck = await user_hate_food.findOne({
      attributes: ['fd_category'],
      where: {
        user_id: userobj.id
      }
    });

    if (usercheck) {
      res.send(usercheck);
    } else {
      res.send('');
    }
  }
};
