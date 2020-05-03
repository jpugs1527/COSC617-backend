const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const formData = require('express-form-data')
const db = require('../lib/db');
const rentCollection = "rent";
const vehicleCollection = "vehicles";
const schedule = require("node-schedule");
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
        db.getDB().collection(vehicleCollection).updateOne({_id: db.getPrimaryKey(rentObj.vehicleId)}, { $set: {status: "rented"} }, function(err, response) {
          if (err) {
            console.log(err);
          }
        });
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
});

// Code that runs just daily to check if a rental period is over and 
// automatically makes that vehicle available again ("59 11 * * *")
var resetRentals = schedule.scheduleJob("59 11 * * *", function() {
  var date = new Date();
  var dateArr, m, d, y;
  var currVehicle;

  db.getDB().collection(rentCollection).find({}).toArray((err, rentals) => {
    rentals.forEach(rental => {
      // Parse through string to get rental end date
      dateArr = rental.end.split("/");
      m = dateArr[0];
      d = dateArr[1];
      y = dateArr[2];

      var currVehicle;
      // Some reason this isnt working.  Works as expected but not the best solution without this.
      // Get the vehicle associated with the rental
      // db.getDB().collection(vehicleCollection).find({_id: db.getPrimaryKey(rental.vehicleId)}), ((err, vehicle) => {
      //   console.log(vehicle);
      //   currVehicle = vehicle;

        if (m == date.getMonth()+1 && d == date.getDate() && y == date.getFullYear()) {
          console.log("Resetting to available");
          db.getDB().collection(vehicleCollection).updateOne({_id: db.getPrimaryKey(rental.vehicleId)}, { $set: {status: "available"} }, function(err, response) {
            if (err) {
              console.log(err);
            }
          });
        }
      // });
    });
  });
});


module.exports = router;