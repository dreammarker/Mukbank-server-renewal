const express = require('express');
// const passport = require('passport');

const router = express.Router();

const { authController } = require('../controller');

//router.get('/', authController.info.get);
//구글 같은 경우는 인증정보만 가져와서 값만 넘겨주면 된다.
router.post('/google/signin', authController.google.signin);

router.post('/kakao/signin', authController.kakao.signin);

// //* kakao
router.get('/kakao', authController.kakao.access);

router.get('/kakao/callback', authController.kakao.callback);

// router.get(
//   '/kakao/callback',
//   passport.authenticate('kakao', {
//     failureRedirect: 'http://localhost:5001/auth',
//     session: false
//   }),
//   authController.kakao.get
// );

// //* facebook
// router.get(
//   '/facebook',
//   passport.authenticate('facebook', {
//     // https://developers.facebook.com/docs/facebook-login/permissions/?translation#reference-default
//     scope: ['email', 'user_age_range', 'user_gender']
//   })
// );

// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', {
//     failureRedirect: 'http://localhost:5001/auth',
//     session: false
//   }),
//   authController.facebook.get
// );

// //* naver
// router.get(
//   '/naver',
//   passport.authenticate('naver', {
//     // https://developers.facebook.com/docs/facebook-login/permissions/?translation#reference-default
//     scope: ['email', 'user_age_range', 'user_gender']
//   })
// );

// router.get(
//   '/naver/callback',
//   passport.authenticate('naver', {
//     failureRedirect: 'http://localhost:5001/auth',
//     session: false
//   }),
//   authController.naver.get
// );

module.exports = router;
