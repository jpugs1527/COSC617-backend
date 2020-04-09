const express = require("express");
const router = express.Router();
const db = require('../lib/db');
const collection = "users";

/* Return all users in the db. */
router.get('/all', function (req, res, next) {
  db.getDB().collection(collection).find({}).toArray((err, documents) => {
    if (err) throw err;
    res.json(documents);
  });
});

// Create a new user
router.post('/new', function (req, res, next) {
  var usrObj = req.body;
  console.log("Creating user");
  db.getDB().collection(collection).insertOne(usrObj, function(err, response) {
    if (err) {
      res.status(500).send({ error: "Unable to create user" });
      console.log(err);
    } else {
      res.status(200).send({ createdUser: usrObj });
    }
  });
});

// Route to edit a user
router.put('/{id}/edit', function (req, res, next) {

});

module.exports = router;