require('dotenv').config();
const { sequelize } = require('../../models/index');
import { QueryTypes } from 'sequelize';
import express from 'express'
export = {
  post: (req:express.Request, res:express.Response) => {
    try {
      let latitude:string = req.body.latitude;//위도 
      let longitude:string = req.body.longitude;//경도
      let text:string = req.body.text;//무엇으로 검색할거야?
      let paging:number = req.body.paging; //몇페이지?
      let count:number  = req.body.count; //몇개씩 출력할것인가?
      if(!text){
          return new Error("searchText를 입력해주세요.");
      }
      if(!paging){
          paging = 1;
      }
      if(!count){
          count = 20;
      } 
      let start:number = (paging-1)*count+1;
      let end:number = (paging)*count;

      let query : string =
        '  SELECT                 ' +
        ' rest.id,                ' +
        ' rest.name,              ' +
        ' rest.address,           ' +
        ' rest.phone,             ' +
        ' rest.roadAddress,       ' +
        ' rest.latitude,          ' +
        ' rest.longitude,         ' +
        ' rest.image,             ' +
        ' fd_category.firstchild, ' +
        ' fd_category.secondchild,' +
        ' fd_category.parent      ,' +
        ' (6371 * ACOS(COS(RADIANS(' +
        latitude +
        ')) * COS(RADIANS(rest.latitude)) * COS(RADIANS(rest.longitude) - RADIANS(' +
        longitude +
        ')) + SIN(RADIANS(' +
        latitude +
        ')) * SIN(RADIANS(rest.latitude)))) AS distance' +
        ' FROM                    ' +
        '     restaurants AS rest    ' +
        ' JOIN   food_categories AS fd_category ON rest.fd_category_id = fd_category.id'+
        ' WHERE latitude is not NULL '+ 
        ' AND  longitude is not NULL '+
        ' HAVING distance is not null'+
        ' and name like "%'+ text+'%"'+
        ' ORDER BY distance'+
        ' limit '+String(count) +' offset '+String(start);

      sequelize
        .query(query, {
          type: QueryTypes.SELECT
        })
        .then((result:any) => {
          if (result) {
            res.send(result);
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
