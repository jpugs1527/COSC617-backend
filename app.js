require('dotenv').config();
var express = require('express');
var app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const db = require('./lib/db');


db.connect((err) => {
  if (err) {
    console.log("Unable to connect to db :(");
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`App successfully connected to database. Runnning at localhost: ${ port }`);
    });
  }
})

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

// Tell app.js where to get the controllers
const userController = require('./controllers/userController');
const vehicleController = require('./controllers/vehicleController');

app.get('/', (req, res) => {

});

app.use('/user', userController);
app.use('/vehicle', vehicleController);