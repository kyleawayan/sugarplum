require('dotenv').config()
import nc from 'next-connect';
import { createPortal } from 'react-dom';
var passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi()
var username

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callback
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.getMe()
      .then(function(data) {
        // Output items
        username = data.body.display_name
      }, function(err) {
        console.log('user get error!', err);
      });
      spotifyApi.getMyTopArtists({ time_range: "medium_term", limit: "10"
      })
      .then(function(data) {
        // Output items
        async function run() {
          await client.connect()
          const collection = client.db("sugarplum-webapp").collection("spotify profiles")
          await collection.insertOne( { username: `${username}`, topartists: data.body.items })
          client.close();
        }
        run()
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