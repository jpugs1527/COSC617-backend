require('dotenv').config();
var express = require('express');
var app = express();
const db = require('./lib/db');

db.connect((err) => {
  if (err) {
    console.log("Unable to connect to db :(");
    process.exit(1);
  } else {
    app.listen(3000);
    console.log("App successfully connected to database. Runnning at localhost:3000");
  }
})

// Tell app.js where to get the controllers
const userController = require('./controllers/userController');

app.get('/', (req, res) => {

});

app.use('/user', userController);