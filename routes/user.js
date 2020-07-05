const express = require('express');

const router = express.Router();

const { userController } = require('../controller');

router.get('/info', userController.info.get);
router.get('/hatefoodSelect', userController.userhatefd.get); //유저가 싫어하는 음식..
router.post('/hatefoodUpdate', userController.userhatefd.post); //유저가 싫어하는 카테고리 선택시 분류해서 입력.
router.post('/userlocation', userController.userLocation.post); //유저의 지역정보 위치
router.post('/restlikeupdate', userController.userrestlike.post); //유저의 좋아요 update 및 insert
router.post('/userrestsel', userController.userrestlike.get); //user의 식당별 좋아요 체크
router.post('/userrestlist', userController.userrestlist.post); //user별로 list
module.exports = router;
