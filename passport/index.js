const passportJWT = require('passport-jwt');

const JwtStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

const google = require('./googleStrategy');
const kakao = require('./kakaoStrategy');
const facebook = require('./facebookStrategy');
// const naver = require('./naverStategy');
const { user } = require('../models');
require('dotenv').config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;

module.exports = passport => {
  console.log('opts=====================================', opts);

  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      console.log('pay~~~===========================', jwtPayload);
      user
        .findById(jwtPayload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );

  google(passport);
  kakao(passport);
  facebook(passport);
  // naver(passport);
};
