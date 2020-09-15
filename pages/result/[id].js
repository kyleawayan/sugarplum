const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
import { useRouter } from 'next/router'
const uri = process.env.uri;
import { Spinner, Image, Col, Row, Container } from 'react-bootstrap';

function Result({ results }) {
    const router = useRouter()
  
    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return (
            <Container>
                <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
            </Container>
        )
    }
  
    // Render post...
    return (
        <div>
            <Container>
            <div className = 'top'>
                <Image src={ results.pfp } roundedCircle />
                <h1>{ results.username }</h1><br></br>
                <Image src={ results.topartists[0].images[0].url } roundedCircle />
                <h2> { results.topartists[0].name } </h2>
                <Image src={ results.topartists[1].images[1].url } roundedCircle />
                <p> { results.topartists[1].name } </p>
                <Image src={ results.topartists[2].images[2].url } roundedCircle />
                <p> { results.topartists[2].name } </p>
            </div>
            </Container>
        </div>
    )
  }

export async function getStaticPaths() {
    return {
        // Only `/posts/1` and `/posts/2` are generated at build time
        paths: [{ params: { id: '1' } }],
        // Enable statically generating additional pages
        // For example: `/posts/3`
        fallback: true,
    }
}

export async function getStaticProps({ params }) {
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
    const collection = client.db("sugarplum-webapp").collection("spotify profiles")

    const query = { _id: ObjectId(params.id)};

    const options = {

    };

    const databasedata = await collection.findOne(query, options);
    var results = JSON.parse(JSON.stringify(databasedata))

    return {
        props: {
            results,
        },
        revalidate: 1,
    }
    client.close()
}

export default Result