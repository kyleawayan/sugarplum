import nc from 'next-connect';
var passport = require('passport');

const handler = nc()
  .get(passport.authenticate('spotify', {
    failureRedirect: '/api/spotify',
    session: false
  }), (req, res) => {
    res.end();
  })

export default handler;