import nc from "next-connect";
var passport = require("passport");
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.uri;

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const handler = nc().get(
  passport.authenticate("spotify", {
    failureRedirect: "/api/spotify",
    session: false,
  }),
  (req, res) => {
    async function getId() {
      const client = await MongoClient.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      const collection = client
        .db("sugarplum-webapp")
        .collection("spotify profiles");

      const query = { code: req.query.code };

      const options = {
        projection: { _id: 1 },
      };

      await timeout(500);
      const id = await collection.findOne(query, options);

      if (id == null) {
        res.redirect("/err");
      } else {
        res.redirect(`/result/${id._id}`);
      }
      client.close();
    }
    getId();
  }
);

export default handler;