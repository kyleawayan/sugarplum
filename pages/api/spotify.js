import nc from 'next-connect';
var passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi()
var username
var toptracks

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callback,
      passReqToCallback: true,
    },
    function(req, accessToken, refreshToken, expires_in, profile, done) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.getMe()
      .then(function(data) {
        // Output items
        username = data.body.display_name
      }, function(err) {
        console.log('user get error!', err);
      });
      spotifyApi.getMyTopTracks({ time_range: "medium_term", limit: "10"
    })
    .then(function(data) {
      // Output items
      async function run() {
        toptracks = data.body.items
      }
      run()
    }, function(err) {
      console.log('top artists get error!', err);
    });
      spotifyApi.getMyTopArtists({ time_range: "medium_term", limit: "10"
      })
      .then(function(data) {
        // Output items
        async function run() {
          try {
            await client.connect()
            const collection = client.db("sugarplum-webapp").collection("spotify profiles")
            const filter = { username: `${username}`}
            const options = { upsert: true };
            const updateDoc = {
              $set: { date: new Date(), topartists: data.body.items, toptracks: toptracks, code: req.query.code }
            };
            await collection.findOneAndUpdate(filter, updateDoc, options)
          } finally {
            await client.close();
          }
        }
        run().catch(console.dir)
      }, function(err) {
        console.log('top artists get error!', err);
      });
      return done(null, done);
    }
  ))

const handler = nc()
  .get(passport.authenticate('spotify', {
    scope: ['user-top-read']
  }), (req, res) => {
})

export default handler;