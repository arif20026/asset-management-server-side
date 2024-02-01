const express = require('express');
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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


    const customRequestCollection = client.db("assetDb").collection("customRequests")
    const productCollection = client.db("assetDb").collection("products")
    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection


    app.post('/customRequests', async (req, res) => {
      const customRequest = req.body;
      const result = await customRequestCollection.insertOne(customRequest);
      res.send(result);
    });


    app.get('/customRequests', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await customRequestCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/customRequests/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      console.log(query)


      const result = await customRequestCollection.findOne(query);
      console.log(result)
      res.send(result);
    })

    app.put('/customRequests/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedRequest = req.body

      const blog = {
        $set: {
          name: updatedRequest.updatedName,
          price: updatedRequest.updatedPrice,
          image: updatedRequest.updatedImage,
          type: updatedRequest.updatedTyPe,
          whyNeeded: updatedRequest.updatedWhyNeeded,
          additionalInfo: updatedRequest.updatedAdditionalInfo,
        }
      }

      const result = await customRequestCollection.updateOne(filter, blog, options)
      res.send(result)
    })

    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });


    app.get('/products', async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    app.get('/api/assetSum', async (req, res) => {
      try {
        const assetTypeFilter = req.query.assetType || '';

        const searchTerm = req.query.searchTerm || '';

        const matchCondition = {};

     

        if (assetTypeFilter) {
          matchCondition.type = assetTypeFilter;
        }

        if (searchTerm) {
          matchCondition.$or = [
              { _id: { $regex: searchTerm, $options: 'i' } },
              // Add other fields you want to search here
          ];
      }

     

        const result = await productCollection.aggregate([
          {
            $match: matchCondition,
          },
          {
            $group: {
              _id: '$name',
              type: { $first: '$type' },
              totalQuantity: { $sum: { $toInt: '$quantity' } },
            },
          },
        ]).toArray();

        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
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