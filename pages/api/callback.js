import nc from 'next-connect';
var passport = require('passport');

const handler = nc()
  .get(passport.authenticate('spotify', {
    failureRedirect: '/api/spotify',
    session: false
  }), (req, res) => {
    console.log(req.query.code)
    async function getId() {
      try {
        await client.connect()
        const collection = client.db("sugarplum-webapp").collection("spotify profiles")

        const query = { token: req.query.code };

        const options = {
            projection: { _id: 1 },
        };

        const results = await collection.findOne(query, options);

        console.log(results);
        return {
            props: {
                results,
            },
        }

      } finally {
      await client.close();
      }
    }
    res.json("hahaha i stole all ur spotify data HAAAHAHAHAHAAH its in my database now muahhaha jk just ur spotify top artists are there lmk and ill send them to u cuz sugarplum cant do it rn");
  })

export default handler;