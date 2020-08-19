const { user_location_statics } = require('../../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
import axios from 'axios';
import express from 'express'
export = {
  post: async (req: express.Request, res:express.Response) => {
    //좌표 정보를 가지고 온다..
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let url = 'https://dapi.kakao.com/v2/local/geo/coord2address.json';
    url += '?x=' + encodeURI(longitude);
    url += '&y=' + encodeURI(latitude);
    console.log(url);
    let location = await axios
      .get(url, {
        headers: {
          Authorization: 'KakaoAK ' + process.env.KAKAO_REST_ID,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
      .then((result:any) => {
        return result.data;
      });

    if (location.meta.total_count < 1) {
      //갯수가 1보다 작다..상태가 이상할떄..
      res.status(500);
      res.send('올바른 좌표값이 아닙니다.');
    } else {
      let  token:any = req.headers;
      token = token.authorization.split(' ')[1];
      // console.log('token~~~~,', token);
      const userobj = jwt.verify(token, process.env.JWT_KEY).data;
      let location_data = location.documents[0].address.address_name;
      //유저를 체크 한다... 지역+user유저 체크
      let usercheck = await user_location_statics.findOne({
        where: {
          user_id: userobj.id,
          location: location_data
        }
      });
      if (usercheck) {
        //update
        user_location_statics.update(
          {
            count: usercheck.dataValues.count + 1
          },
          {
            where: {
              id: usercheck.id
            }
          }
        );
        res.send('update success');
      } else {
        //create
        user_location_statics.create({
          user_id: userobj.id,
          location: location_data,
          count: 1
        });
        res.send('create success');
      }
    }
  }
};
