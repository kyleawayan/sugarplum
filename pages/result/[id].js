const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
import { useRouter } from 'next/router'
const uri = process.env.uri;

function Result({ results }) {
    const router = useRouter()
  
    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
      return <div>Loading...</div>
    }
  
    // Render post...
    return <div>{ results.username }</div>
  }

export async function getStaticPaths() {
    return {
        // Only `/posts/1` and `/posts/2` are generated at build time
        paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
        // Enable statically generating additional pages
        // For example: `/posts/3`
        fallback: true,
    }
}

export async function getStaticProps({ params }) {
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
    const collection = client.db("sugarplum-webapp").collection("spotify profiles")

    const query = { _id: ObjectId(params.id)};
    console.log(query)

    const options = {
        projection: { _id: 0, username: 1 },
    };

    const results = await collection.findOne(query, options);

    console.log(results);
    return {
        props: {
            results,
        },
        revalidate: 1,
    }
    client.close()
}

export default Result