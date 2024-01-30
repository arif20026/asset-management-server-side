const express = require('express');
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;


console.log(process.env.DB_PASS)

// middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8wwrvjl.mongodb.net/?retryWrites=true&w=majority`;

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

    //   await client.connect();


       const customRequestCollection =client.db("assetDb").collection("customRequests")
    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection


    app.post('/customRequests', async (req, res) => {
        const customRequest = req.body;
        const result = await customRequestCollection.insertOne(customRequest);
        res.send(result);
      });


      app.get('/customRequests', async (req, res) => {
        const result = await customRequestCollection.find().toArray();
        res.send(result);
      });
  
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('assignment 12 is running')
})

app.listen(port, () => {
    console.log(` assignment 12 Server is running on port ${port}`)
})