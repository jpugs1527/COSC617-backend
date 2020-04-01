var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Tell app.js where to get the controllers
const userController = require

app.get('/', (req, res) => {
  res.send("hello world");
})

app.use('user', userController);

app.listen(3001);