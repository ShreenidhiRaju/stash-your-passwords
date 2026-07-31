require('dotenv').config()
const express = require('express');
const cors=require('cors')
const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);


// Database Name
const dbName = 'passop';
const app = express();
app.use(express.json())
app.use(cors())

const port = 3000;
client.connect();
const db = client.db(dbName);


//get passwords
app.get('/', async(req, res) => {
  const collection = db.collection('documents');
  const findResult = await collection.find({}).toArray();
  res.json(findResult);
});

//delete passwords
app.delete('/', async(req, res) => {
  const collection = db.collection('documents');
  const findResult = await collection.deleteOne({id:req.body.id});
  res.json({findResult});
});

//insert passwords
app.post('/', async(req, res) => {
  const password=req.body
  const collection = db.collection('documents');
  const findResult = await collection.insertOne(password);
  res.json({"success":true});
});

//update passwords
app.put('/', async(req, res) => {
  const collection = db.collection('documents');
  const findResult = await collection.updateOne({id:req.body.id},{$set:{site:req.body.site,username:req.body.username,password:req.body.password}});
  res.json({"success":true});
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});