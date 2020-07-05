const FacebookStrategy = require('passport-facebook').Strategy;
const { user } = require('../models');

module.exports = passport => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email', 'name']
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('face profile~~: ', profile);
        try {
          const exUser = await user.findOne({
            where: { snsId: profile.id, provider: 'facebook' }
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await user.create({
              nick: profile.displayName,
              snsId: profile.id,
              email: profile._json.email,
              provider: 'facebook'
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
