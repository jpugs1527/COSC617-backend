const express = require("express");
const axios = require("axios");
const router = express.Router();
const db = require('../lib/db');
const collection = "users";

/* Return all users in the db. */
router.get('/all', function (req, res, next) {
  db.getDB().collection(collection).find({}).toArray((err, documents) => {
    if (err) throw err;
    console.log(documents);
    res.json(documents);
  });
});

// Create a new user
router.post('/new', function (req, res, next) {
  var usrObj = req.body;
  console.log("Creating user");
  db.getDB().collection(collection).insertOne(usrObj, function(err, res) {
    if (err) throw err;
    console.log("User created");
  });
});

module.exports = router;