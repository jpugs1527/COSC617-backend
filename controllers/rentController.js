const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const formData = require('express-form-data')
const db = require('../lib/db');
const collection = "rent";

router.use(formData.parse())

router.post('/add', function (req, res, next) {
    var rentObj = req.body;
  
    jwt.verify(rentObj.token,'supersecret', function(err, decoded){
      if(err){
        res.send({
          error: err,
          message: "Failed to authorize user"
        });
      }
    });
  
    delete rentObj.token;
    
    db.getDB().collection(collection).insertOne(rentObj, function(err, response) {
      if (err) {
        res.send({
          error: err,
          message: "Failed to add rent history"
        });
      } else {
        res.send({
          error: false,
          message: "Successfully added rent history"
        });
      }
    });
});

router.get('/view_all/:vehicleId', (req, res) => {
    db.getDB().collection(collection).find({vehicleId : req.params.vehicleId}).toArray((err, documents) => {
      if (err) throw err;
      res.json(documents);
    });
  })

module.exports = router;