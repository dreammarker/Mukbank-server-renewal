
import express from 'express';
const router :express.Router = express.Router();
import userController from '../controller/user/index';

router.get('/info', userController.info.get);
router.get('/hatefoodSelect', userController.userhatefd.get); //유저가 싫어하는 음식..
router.post('/hatefoodUpdate', userController.userhatefd.post); //유저가 싫어하는 카테고리 선택시 분류해서 입력.
router.post('/userlocation', userController.userLocation.post); //유저의 지역정보 위치
router.post('/restlikeupdate', userController.userrestlike.post); //유저의 좋아요 update 및 insert
router.post('/userrestsel', userController.userrestlike.get); //user의 식당별 좋아요 체크
router.post('/userrestlist', userController.userrestlist.post); //user별로 list
router.post('/signup',userController.usersignup.post); //회원가입..
router.post('/signin',userController.usersignin.post); //로그인
router.post('/idCheck',userController.userIdCheck.post);// 아이디 중복확인.
router.get('/usertokenCheck',userController.usertokenCheck.get); //userToken체크
router.get('/signout',userController.usersignout.get); //로그아웃
module.exports = router;
