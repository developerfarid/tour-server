const express = require('express')
const { MongoClient } = require("mongodb");
const app = express()
const cors = require("cors")
const ObjectId = require('mongodb').ObjectId;
const port = 5000
require("dotenv").config();
// middle war
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.doqsn.mongodb.net/tour-database?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
async function run() {
    try {
      await client.connect();
      const database = client.db('tour');
        const productCollection = database.collection('productAdd');
        const bookingCollection = database.collection('booking');
        
        app.get("/allProduct", async (req, res) => {
            const query = productCollection.find({})
            const result = await query.toArray()
            res.send(result)
        })
      app.get("/booking/:email", async (req, res) => {
        const email = req.params.email
        console.log(email);
         
            const query = bookingCollection.find({email :email })
            const result = await query.toArray()
            res.send(result)
        })
        app.post("/allProduct", async (req, res) => {
            const result = await productCollection.insertOne(req.body)
            res.json(result)
            console.log(result);
        })
        app.post("/booking", async (req, res) => {
            const result = await bookingCollection.insertOne(req.body)
            res.json(result)
            console.log(result);
        })
      
      app.delete("/booking/:id", async (req, res) => {
        const id = req.params.id
        const query = { key: id };
        const result = await bookingCollection.deleteOne(query)
            res.send(result)

      })
      app.get("/allProduct/:id", async (req, res) => {
        const id = req.params.id
        const query = { _id: ObjectId(id)};
            const result = await productCollection.findOne(query)
            res.send(result)
      })
    //   app.get('/users/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const user = await usersCollection.findOne(query);
    //     // console.log('load user with id: ', id);
    //     res.send(user);
    // })

        
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})