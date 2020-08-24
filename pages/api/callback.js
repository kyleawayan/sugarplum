import nc from 'next-connect';
var passport = require('passport');

const handler = nc()
  .get(passport.authenticate('spotify', {
    failureRedirect: '/api/spotify',
    session: false
  }), (req, res) => {
    res.json("hahaha i stole all ur spotify data HAAAHAHAHAHAAH its in my database now muahhaha jk just ur spotify top artists are there lmk and ill send them to u cuz sugarplum cant do it rn");
  })

export default handler;