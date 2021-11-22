const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const { query } = require('express');
require('dotenv').config();
const port = process.env.PORT ||5000;

app.use(cors());
app.use(express.json());


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y387w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{

        await client.connect()
        const database = client.db('doctors_portal');
        const appointmentCollections = database.collection('appoinments');
        const usersCollections = database.collection('users');

        // post data 
        app.post('/appoinments',async(req,res)=>{
          const appointment = req.body;
          const result = await appointmentCollections.insertOne(appointment);
          // console.log(appointment);
          res.json(result)
          
        })
        // get data 
        app.get('/appoinments',async(req,res)=>{
          const email = req.query.email;
          const date =new Date(req.query.date).toLocaleDateString();
          const query = {email:email,date:date}
          const cursor = appointmentCollections.find(query);
          const appoinments = await cursor.toArray();
          res.json(appoinments);
        })

        // post users 
        app.post('/users', async(req,res)=>{
          const user = req.body;
          const result = await usersCollections.insertOne(user);
          console.log(result);
          res.json(result);
        })

        // post google users 

        app.put('/users', async(req,res)=>{
          const user = req.body;
          const filter = {email : user.email};
          const options = { upsert: true };
          const updateDoc = {$set:user}
          const result = await usersCollections.updateOne(filter,updateDoc,options);
          res.json(result);
        })

    }
    finally{
        // await client.close()
    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello Doctors!')
})

app.listen(port, () => {
  console.log(`listening Doctors at :${port}`)
})