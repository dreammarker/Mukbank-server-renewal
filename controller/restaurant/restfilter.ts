require('dotenv').config();
const { sequelize } = require('../../models/index');
import { QueryTypes } from 'sequelize';
import express from 'express'
import { FILE } from 'dns';
export = {
  post: (req:express.Request, res:express.Response) => {
    try {
      let latitude:string = req.body.latitude;//위도 
      let longitude:string = req.body.longitude;//경도
      let paging:number = req.body.paging; //몇페이지?
      let count:number  = req.body.count; //몇개씩 출력할것인가?
      let filterText:Array<string> =  req.body.filterText.split(","); //
      
      if(!paging){
          paging = 1;
      }
      if(!count){
          count = 20;
      } 
      let foodParent = "";
      let CafeParent = "";

      // AND fd_category.parent = '음식점' AND  fd_category.firstchild  IN ('한식')
      // OR  fd_category .parent ='카페'

      //카페일 경우 카페만 조회
      if(filterText.includes("카페")){
          if(filterText.length===1)
          {
            CafeParent = " AND fd_category.parent = '카페'";
          }
          else
          {
            CafeParent = " OR fd_category.parent='카페'";
          }
      }
      
      
       //아닐 경우에 배열에 있는 모든 한식 , 중식 , 같은 음식 범주를 가져와서 SQL 에 넣을 세부적인 쿼리문을 만든다.
     filterText = filterText.filter((element:string)=>element!=="카페")
     if(filterText.length!==0){
      foodParent += " AND fd_category.parent = '음식점'";
      foodParent+=" AND fd_category.firstchild IN (";
        for (let i = 0; i < filterText.length; i++) {
          foodParent += "'" + filterText[i].trim() + "',";
        }
        foodParent = foodParent.slice(0, -1);
        foodParent += ')';  
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
        ' HAVING distance is not null'+
        foodParent+ 
        CafeParent+
        ' ORDER BY distance'+
        ' limit '+String(start)+' ,'+String(end);

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
