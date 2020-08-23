import nc from 'next-connect';
var passport = require('passport');
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();

const handler = nc()
  .get(passport.authenticate('spotify', {
    failureRedirect: '/api/spotify',
    session: false
  }), (req, res) => {
    res.end();
  })

export default handler;