const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const formData = require('express-form-data')
const db = require('../lib/db');
const rentCollection = "rent";
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
    
    db.getDB().collection(rentCollection).insertOne(rentObj, function(err, response) {
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
  db.getDB().collection(rentCollection).find({vehicleId : req.params.vehicleId}).toArray((err, documents) => {
    if (err) throw err;
    res.json(documents);
  });
})

router.get('/view_by_user/:userId', (req, res) => {
  db.getDB().collection(rentCollection).find({userId : req.params.userId}).toArray((err, rentDocuments) => {
    if (err) throw err;
    res.send(rentDocuments);
  });
})

module.exports = router;