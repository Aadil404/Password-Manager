
const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors=require('cors')

dotenv.config()
const app = express()
const port = 3000
app.use(bodyParser.json())
app.use(cors())

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'myPasswordManager';
const db = client.db(dbName);
const collection = db.collection('Passwords');

client.connect();

//get all the passwords
app.get('/', async (req, res) => {
    const findResult = await collection.find({}).toArray();
    res.send(findResult)
})

//save a password
app.post('/', async (req, res) => {
    const password=req.body;
    const result = await collection.insertOne(password);
    res.send(result)
})

//delete a password
app.delete('/', async (req, res) => {
    const password=req.body;
    const result = await collection.deleteOne(password);
    res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})