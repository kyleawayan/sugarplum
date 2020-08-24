import nc from 'next-connect';
import id from './spotify'
var passport = require('passport');

const handler = nc()
  .get(passport.authenticate('spotify', {
    failureRedirect: '/api/spotify',
    session: false
  }), (req, res) => {
    function redirect() {
      if(typeof id !== "undefined"){
        res.redirect(id)
    }
    else{
        setTimeout(waitForElement, 250);
    }
      res.redirect
    }
  })

export default handler;