var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { Connection } = require('./lib/mongoConnection');

// Establishing db connection
Connection.connectToMongo();
console.log(Connection);

// Tell app.js where to get the controllers
const userController = require('./controllers/userController');

app.get('/', (req, res) => {
  res.json({text:"hello world"});
})

app.use('/user', userController);

app.listen(3000);