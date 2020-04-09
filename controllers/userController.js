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

// User sign on
router.post('/login', function (req, res, next) {
  var usrObj = req.body;

  // TODO get findOne working
  db.getDB().collection(collection).find({ username : usrObj.username }).toArray((err, documents) => {
    if (err) throw err;
    
    //TODO encrypt password and make sure username is unique
    if (documents[0].password == usrObj.password) {
      var token = jwt.sign( {username:usrObj.username},'supersecret',{ expiresIn:1800} );
      res.send( {token: token, user: documents[0]} );
    } else {
      // return an empty token - this will set the local storage on F/E to empty
      res.send( {token: ""} );
    }
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