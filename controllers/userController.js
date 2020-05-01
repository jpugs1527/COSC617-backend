const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../lib/db');
const collection = "users";
const bcrypt = require("bcryptjs")

const saltRounds = 10

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

  // Creates an index to ensure the username field is unique
  db.getDB().collection(collection).createIndex( { "username": 1 }, { unique: true } );

  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "Unable to create user" });
    } else {
      bcrypt.hash(usrObj.password, salt, function(err, hash) {
        if (err) {
          throw err
        } else {
          delete usrObj.password;
          usrObj.hash = hash;
          db.getDB().collection(collection).insertOne(usrObj, function(err, response) {
            if (err) {
              res.status(500).send({ error: "Unable to create user" });
            } else {
              res.status(200).send({ createdUser: usrObj });
            }
          });
        }
      })
    }
  });
});

// TODO Route to edit a user
router.put('/edit/:id', function (req, res, next) {
  var usrObj = req.body;
  var newvalues = { $set: usrObj };

  db.getDB().collection(collection).findOneAndUpdate({_id: db.getPrimaryKey(req.params.id)}, newvalues, { returnOriginal: false }, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      //delete result.value.password;
      delete result.value.password;
      res.send(result);
    }
  });
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
      bcrypt.compare(usrObj.password, documents[0].hash, function(err, isMatch) {
        if (err) {
          console.log(err);
          ret.error = true;
        } else if (isMatch) {
          delete documents[0].hash;
          ret.token = jwt.sign( {username:usrObj.username},'supersecret',{ expiresIn:1800} );
          ret.user = documents[0];
          ret.error = false;
          ret.message = "Valid credentials"
        }
        res.send( ret );
      })
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