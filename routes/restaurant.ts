import express from 'express';

const router :express.Router = express.Router();

import restaurantController  from '../controller/restaurant/index';

router.post('/distance', restaurantController.restdistance.post); //식당 거리
router.post('/distancestartend', restaurantController.distancestend.post); //거리의 시작과끝을 정한 식당정보
router.get('/category', restaurantController.fdcategory.get); //카테고리
router.post('/detail', restaurantController.restdetail.post); //식당세부정보
router.post('/restlike', restaurantController.restlike.post); //한식당의 like 횟수정보
router.post('/restpaging', restaurantController.restdistance.paging); //paging
router.post('/search',restaurantController.restsearch.post); //search 검색 
router.post('/selectFilter',restaurantController.restfilter.post); // filter 기능
module.exports = router;
