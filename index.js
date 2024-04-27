const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

//art-and-craft-store
//hXbpDfiMbAfn77iu

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kwtddbl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kwtddbl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const artCollection = await client.db("art-store").collection('art')

    app.post('/arts', async (req, res) => {
      const newArt = req.body;
      console.log(newArt)

      const result = await artCollection.insertOne(newArt)
      res.send(result)
    })


    app.get('/arts', async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray()

      res.send(result)
    })

    app.get(`/singleArts/:id`, async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await artCollection.findOne(query)
      res.send(result)
    })

    app.get('/myCurt/:id', async(req, res) => {
      const id = req.params.id;
      const result = await artCollection.find({email : id}).toArray();

      res.send(result)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Art and Craft Store running');
})


app.listen(port, (req, res) => {
  console.log(`Art and Craft Store running on ${port}`)
})
