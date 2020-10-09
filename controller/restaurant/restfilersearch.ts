require('dotenv').config();
const { sequelize } = require('../../models/index');
import { QueryTypes } from 'sequelize';
import express from 'express'
import { FILE } from 'dns';
export = {
  post: (req:express.Request, res:express.Response) => {
    try {
      let latitude:string = req.body.latitude;   //위도 
      let longitude:string = req.body.longitude; //경도
      let paging:number = req.body.paging; //몇페이지?
      let count:number  = req.body.count;  //몇개씩 출력할것인가?
      let filter:string = req.body.filter;  //
      let search:string = req.body.search;
      //페이징 처리..
      if(!paging){
        paging = 1;
      }
      if(!count){
        count = 20;
      } 

      let start:number = (paging-1)*count+1;
      let end:number = (paging)*count;
      let query:string = "";
      //검색과 필터 두개다 아무것도 입력 받지 않은 경우...
      if(filter.trim()===""&&search.trim()===""){
         query  =
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
        ' ORDER BY distance'+
        ' limit '+String(count) +' offset '+String(start);
      }
      else if(filter.trim()===""){//검색창만 써서 넘겼을 경우...
        query = 
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
        ' AND name like "%'+ search+'%"'+
        ' HAVING distance is not null'+
        ' ORDER BY distance'+
        ' limit '+String(count) +' offset '+String(start);
      }
      else if(search.trim()===""){ //필터 썻을 경 우..
        let foodParent = "";
        let CafeParent = "";
  
        // AND fd_category.parent = '음식점' AND  fd_category.firstchild  IN ('한식')
        // OR  fd_category .parent ='카페'
        let filterArr:Array<string> = filter.replace(/ /gi,"").split(","); //
        //카페일 경우 카페만 조회
        if(filterArr.includes("카페")){
            if(filterArr.length===1)
            {
              CafeParent = " AND fd_category.parent = '카페'";
            }
            else
            {
              CafeParent = " OR fd_category.parent='카페'";
            }
        }
        
         //아닐 경우에 배열에 있는 모든 한식 , 중식 , 같은 음식 범주를 가져와서 SQL 에 넣을 세부적인 쿼리문을 만든다.
         filterArr = filterArr.filter((element:string)=>element!=="카페")
     
       if(filterArr.length!==0){
        foodParent += " AND fd_category.parent = '음식점'";
        foodParent+=" AND fd_category.firstchild IN (";
          for (let i = 0; i < filterArr.length; i++) {
            foodParent += "'" + filterArr[i].trim() + "',";
          }
          foodParent = foodParent.slice(0, -1);
          foodParent += ')';  
        }

        query  =
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
        foodParent+ 
        CafeParent+
        ' ORDER BY distance'+
        ' limit '+String(count) +' offset '+String(start);
      }
      else{ //검색과 필터 기능 두개다 썻을 경우.
        let foodParent = "";
        let CafeParent = "";
  
        // AND fd_category.parent = '음식점' AND  fd_category.firstchild  IN ('한식')
        // OR  fd_category .parent ='카페'
        let filterArr:Array<string> = filter.replace(/ /gi,"").split(","); //
        //카페일 경우 카페만 조회
        if(filterArr.includes("카페")){
            if(filterArr.length===1)
            {
              CafeParent = " AND fd_category.parent = '카페'";
            }
            else
            {
              CafeParent = " OR fd_category.parent='카페'";
            }
        }
        
         //아닐 경우에 배열에 있는 모든 한식 , 중식 , 같은 음식 범주를 가져와서 SQL 에 넣을 세부적인 쿼리문을 만든다.
         filterArr = filterArr.filter((element:string)=>element!=="카페")
     
       if(filterArr.length!==0){
        foodParent += " AND fd_category.parent = '음식점'";
        foodParent+=" AND fd_category.firstchild IN (";
          for (let i = 0; i < filterArr.length; i++) {
            foodParent += "'" + filterArr[i].trim() + "',";
          }
          foodParent = foodParent.slice(0, -1);
          foodParent += ')';  
        }

        query  =
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
        ' AND name like "%'+ search+'%"'+
        ' HAVING distance is not null'+
        foodParent+ 
        CafeParent+
        ' ORDER BY distance'+
        ' limit '+String(count) +' offset '+String(start);
      }
      
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
