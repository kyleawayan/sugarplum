require('dotenv').config()
import nc from 'next-connect';
var passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: 'http://localhost:3000/api/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      console.log(accessToken)
      token = accessToken
      return done(null, done);
    }
  ))

const handler = nc()
  .get(passport.authenticate('spotify', {
    scope: ['user-top-read']
  }), (req, res) => {
  })

export default handler;