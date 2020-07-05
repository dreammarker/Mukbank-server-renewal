const NaverStrategy = require('passport-naver').Strategy;
const { user } = require('../models');

module.exports = passport => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: '/auth/naver/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('profile!!: ', profile);
        try {
          const exUser = await user.findOne({
            where: {
              snsId: profile.id,
              provider: profile.provider,
              email: profile._json.email
            }
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await user.create({
              email: profile._json.email,
              snsId: profile.id,
              provider: profile.provider
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
