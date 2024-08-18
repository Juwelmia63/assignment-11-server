const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());





// console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohkmion.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const allfooddata = client.db('restrobiz').collection('allfood');
    const purchase = client.db('restrobiz').collection('purchase');
    const imagecollection = client.db('restrobiz').collection('image');


    // geting all food data

    app.get('/allfood', async (req, res) => {
      const result = await allfooddata.find().toArray();

      res.send(result);
    })


    // geting single food data using id

    app.get('/singlefoodpage/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await allfooddata.findOne(query)
      res.send(result)
    })


    // update a single food item by id

    app.put('/food/:id', async (req, res)=>{
      const id = req.params.id
      const fooddata = req.body
      const query = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updateItem = {
        $set : {
          ...fooddata,
        },
      }

      const result = await allfooddata.updateOne(query,updateItem,options)
      res.send(result)
    })

    // deleting single purchase food data using id

    app.delete('/purchase/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await purchase.deleteOne(query)
      res.send(result)
    })


    // save purchase data on bd

    app.post('/purchasedata', async (req, res) => {
      const purchdata = req.body
      const result = await purchase.insertOne(purchdata)
      res.send(result)
    })

    // get purchase data from db
    app.get('/mypurchasedata/:email', async (req, res) => {
      const email = req.params.email
      const query = { buyerEmail: email }
      const result = await purchase.find(query).toArray()
      res.send(result)
    })

    // save FOOD data on bd

    app.post('/addfood', async (req, res) => {
      const addfooddata = req.body
      const result = await allfooddata.insertOne(addfooddata)
      res.send(result)
    })
    // save gallery data on bd

    app.post('/galleryimage', async (req, res) => {
      const addgallerydata = req.body
      const result = await imagecollection.insertOne(addgallerydata)
      res.send(result)
    })

    // geting all gallery data

    app.get('/allgalleryfood', async (req, res) => {
      const result = await imagecollection.find().toArray();

      res.send(result);
    })



    
    // get all food item by email

    app.get('/addfood/:email', async (req, res) => {
      const email = req.params.email
      const query = { 'email': email }
      const result = await allfooddata.find(query).toArray()
      res.send(result)
    })





    // Route to fetch top 6 food items by purchase count
    app.get('/topFoodsItem', async (req, res) => {
      try {
          const topFoods = await allfooddata.find({})
              .sort({ purchaseCount: -1 }) 
              .limit(6)
              .toArray();
          
          res.json(topFoods);
      } catch (error) {
          console.error("Error fetching top foods:", error);
          res.status(500).json({ message: "Failed to fetch top foods" });
      }
  });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('assignment elven data is comming soon')
})

app.listen(port, () => {
  console.log(`port is running on ${port}`);
})



