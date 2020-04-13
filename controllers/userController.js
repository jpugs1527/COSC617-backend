const express = require("express");
const jwt = require('jsonwebtoken');
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

  // Creates an index to ensure the username field is unique
  db.getDB().collection(collection).createIndex( { "username": 1 }, { unique: true } );

  db.getDB().collection(collection).insertOne(usrObj, function(err, response) {
    if (err) {
      res.status(500).send({ error: "Unable to create user" });
      console.log(err);
    } else {
      res.status(200).send({ createdUser: usrObj });
    }
  });
});

// TODO Route to edit a user
router.put('/{id}/edit', function (req, res, next) {

});

// User sign on
router.post('/login', function (req, res, next) {
  var usrObj = req.body;

  var ret = {
    token: "",
    user: "",
    message: "Incorrect credentials",
    error: true
  }

  // TODO get findOne working
  db.getDB().collection(collection).find({ username : usrObj.username }).toArray((err, documents) => {
    if (err) throw err;

    if (typeof documents[0] != "undefined") {
      //TODO encrypt password and make sure username is unique
      if (documents[0].password == usrObj.password) {
        delete documents[0].password;
        ret.token = jwt.sign( {username:usrObj.username},'supersecret',{ expiresIn:1800} );
        ret.user = documents[0];
        ret.error = false;
        ret.message = "Valid credentials"
      } 
    }
    res.send( ret );
  });
});

// User authentication
router.get('/authenticate', function (req, res, next) {
  var token = req.query.token;
  jwt.verify(token,'supersecret', function(err, decoded){
    if(!err){
      res.json( {isLoggedIn : true} );
    } else {
      res.send( {isLoggedIn : false} );
    }
  });
});
module.exports = router;