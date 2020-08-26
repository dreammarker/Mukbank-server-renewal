
const { sequelize } = require('../../models/index');
const { QueryTypes } = require('sequelize');
import express from 'express';
export = {
  //식당정보 및 카페정보 보여주기 식당정보는 사용자가 싫어하는 분류를 필터해서 보여줄수 있다.
  post: async (req:express.Request, res:express.Response) => {
    let latitude:string = req.body.latitude; //짧은게 latitude
    let longitude:string = req.body.longitude; //긴게 longitude
    let sort:string = req.body.sort;
    let hatefd_category = req.body.hatefd_category;
    let parent = req.body.parent;
    let category:boolean|string = false;
    let start = req.body.start;
    let end = req.body.end;
    if (hatefd_category) {
      hatefd_category = hatefd_category.split(',');
      category = 'AND firstchild not IN (';
      for (let i = 0; i < hatefd_category.length; i++) {
        category += "'" + hatefd_category[i] + "',";
      }
      category = category.slice(0, -1);
      category += ')';
    } else {
      category = ''; //전체분류..
    }

    if (parent === '카페') {
      parent = ' AND parent = "카페" ';
    } else {
      parent = ' AND parent = "음식점" ';
    }

    if (sort === 'review') {
      sort = ' reviewsort, distance';
    } else {
      sort = ' distance, reviewsort';
    }

    let query =
      '  SELECT                 ' +
      ' rest.id                 ' +
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
      ' JOIN   food_categories AS fd_category ON rest.fd_category_id = fd_category.id' +
      ' WHERE latitude is not NULL '+ 
      ' AND  longitude is not NULL '+
      ' HAVING distance >= ' +
      start +
      ' AND distance <= ' +
      end +
      category +
      parent +
      ' ORDER BY ' +
      sort;
    let restaurantdata = await sequelize
      .query(query, {
        type: QueryTypes.SELECT
      })
      .catch((result:any) => {
        res.status(500);
        res.send('잘못된 접근입니다.');
      });

    res.send(restaurantdata);
  }
};
