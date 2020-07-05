const { sequelize } = require('../../models/index');
const { QueryTypes } = require('sequelize');
module.exports = {
  //식당정보 및 카페정보 보여주기 식당정보는 사용자가 싫어하는 분류를 필터해서 보여줄수 있다.
  post: async (req, res) => {
    let latitude = req.body.latitude; //짧은게 latitude
    let longitude = req.body.longitude; //긴게 longitude
    let distance = req.body.distance; //거리..
    let sort = req.body.sort;
    let hatefd_category = req.body.hatefd_category;
    let parent = req.body.parent;
    let category = false;
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
      ' JOIN   food_categories AS fd_category ON rest.fd_category_id = fd_category.id' +
      ' HAVING distance <= ' +
      distance +
      category +
      parent +
      ' ORDER BY ' +
      sort;
    let restaurantdata = await sequelize
      .query(query, {
        type: QueryTypes.SELECT
      })
      .catch(result => {
        res.status(500);
        res.send('잘못된 접근입니다.');
      });

    res.send(restaurantdata);
  },
  paging: async (req, res) => {
    let latitude = req.body.latitude; //짧은게 latitude
    let longitude = req.body.longitude; //긴게 longitude
    let distance = req.body.distance; //거리..
    let sort = req.body.sort;
    let hatefd_category = req.body.hatefd_category;
    let parent = req.body.parent;
    let category = false;
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

    let countquery =
      ' select count(*) as count from ' +
      ' ( SELECT                 ' +
      ' rest.name,              ' +
      ' rest.address,           ' +
      ' rest.phone,             ' +
      ' rest.roadAddress,       ' +
      ' rest.latitude,          ' +
      ' rest.longitude,         ' +
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
      ' HAVING distance <= ' +
      distance +
      category +
      parent +
      ')  as countdata';

    let count = await sequelize
      .query(countquery, {
        type: QueryTypes.SELECT
      })
      .catch(result => {
        res.status(500);
        res.send('잘못된 접근입니다.');
      });

    console.log(count);
    //offset 설정..
    let display = req.body.display;
    let start = req.body.start;
    if (!start) {
      start = 0;
    } else {
      start = display * (start - 1);
    }
    let query =
      '  SELECT                 ' +
      ' rest.id  ,              ' +
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
      ' HAVING distance <= ' +
      distance +
      category +
      parent +
      ' ORDER BY ' +
      sort +
      ' LIMIT ' +
      display +
      ' offset ' +
      start;

    let restaurantdata = await sequelize
      .query(query, {
        type: QueryTypes.SELECT
      })
      .catch(result => {
        res.status(500);
        res.send('잘못된 접근입니다.');
      });
    // console.log(restaurantdata);

    res.send({ restaurantdata, count });
  }
};
