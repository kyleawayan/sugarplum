const MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectID;
import { useRouter } from "next/router";
const uri = process.env.uri;
import {
  Spinner,
  Image,
  Col,
  Row,
  Container,
  Pagination,
} from "react-bootstrap";

let active = 2;
let items = [];
items.push(
  <Pagination.Item key="1" active={1 === active}>
    {"2 months"}
  </Pagination.Item>,
  <Pagination.Item key="2" active={2 === active}>
    {"6 months"}
  </Pagination.Item>,
  <Pagination.Item key="3" active={3 === active}>
    {"12 months"}
  </Pagination.Item>
);

function Result({ results }) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return (
      <div className="loading">
        <Container>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Container>
      </div>
    );
  }

  // Render post...
  return (
    <div>
      <Container>
        <div className="top">
          <div className="profile">
            <Image src={results.pfp} roundedCircle />
            <p>{results.username}</p>
            <p>updated {results.date.split('T')[0]}</p>
            <div className="selector">
              <Pagination>{items}</Pagination>
            </div>
          </div>
          <h1>Top Arists</h1>
          <br></br>
          <div className="number1">
            <Image
              src={results.artists_medium[0].images[0].url}
              roundedCircle
            />
            <h2> {results.artists_medium[0].name} </h2>
          </div>
          <div className="number2">
            <Image
              src={results.artists_medium[1].images[1].url}
              roundedCircle
            />
            <h2> {results.artists_medium[1].name} </h2>
          </div>
          <div className="number3">
            <Image
              src={results.artists_medium[2].images[2].url}
              roundedCircle
            />
            <h4> {results.artists_medium[2].name} </h4>
          </div>
        </div>
      </Container>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [{ params: { id: "5f6070cd98597919b296d630" } }],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const collection = client
    .db("sugarplum-webapp")
    .collection("spotify profiles");

  const query = { _id: ObjectId(params.id) };

  const options = {};

  const databasedata = await collection.findOne(query, options);
  var results = JSON.parse(JSON.stringify(databasedata));

  return {
    props: {
      results,
    },
    revalidate: 1,
  };
  client.close();
}

export default Result;
