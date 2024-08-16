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


    // geting all food data

    app.get('/allfood', async (req, res)=>{
      const result = await allfooddata.find().toArray();

      res.send(result);
    })


    // geting single food data using id

    app.get('/singlefoodpage/:id', async (req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await allfooddata.findOne(query)
      res.send(result)
    })


    // save purchase data on bd

    app.post('/purchasedata', async (req, res)=>{
      const purchdata= req.body
      const result = await purchase.insertOne(purchdata)
      res.send(result)
    })
   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('assignment elven data is comming soon')
})

app.listen(port, ()=>{
    console.log(`port is running on ${port}`);
})



