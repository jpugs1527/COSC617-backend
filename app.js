require('dotenv').config();
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const db = require('./lib/db');

db.connect((err) => {
  if (err) {
    console.log("Unable to connect to db :(");
    process.exit(1);
  } else {
    app.listen(port, () => {
        console.log(`Our app is running on port ${ port }`);
    });
    console.log("App successfully connected to database. Runnning at localhost:3000");
  }
})

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

// Tell app.js where to get the controllers
const userController = require('./controllers/userController');

app.get('/', (req, res) => {

});

app.use('/user', userController);