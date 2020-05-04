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

function checkDate(startDate, endDate, todayDate) { 
  start = startDate.split("/"); 
  end = endDate.split("/"); 
  today = todayDate.split("/"); 
    
  var s = new Date(start[2], parseInt(start[1]) - 1, start[0]); 
  var e = new Date(end[2], parseInt(end[1]) - 1, end[0]); 
  var t = new Date(today[2], parseInt(today[1]) - 1, today[0]); 
  if (t > s && t < e) { 
      return true; 
  } else { 
      return false;
  } 
} 

// Code that runs just daily to check if a rental period is over and 
// automatically makes that vehicle available again ("0 0 * * *" or "* * * * *" for dev purposes)
var resetRentals = schedule.scheduleJob("* * * * *", function() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; 
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  db.getDB().collection(rentCollection).find({}).toArray((err, rentals) => {
    rentals.forEach(rental => {

      var currVehicle;
      // Some reason this isnt working.  Works as expected but not the best solution without this.
      // Get the vehicle associated with the rental
      // db.getDB().collection(vehicleCollection).find({_id: db.getPrimaryKey(rental.vehicleId)}), ((err, vehicle) => {
      //   console.log(vehicle);
      //   currVehicle = vehicle;

        if (!checkDate(rental.start, rental.end, today)) {
          console.log("Resetting to available");
          db.getDB().collection(vehicleCollection).updateOne({_id: db.getPrimaryKey(rental.vehicleId)}, { $set: {status: "available"} }, function(err, response) {
            if (err) {
              console.log(err);
            }
          });
        } else if (checkDate(rental.start, rental.end, today)) {
          console.log("Setting status to rented");
            db.getDB().collection(vehicleCollection).updateOne({_id: db.getPrimaryKey(rental.vehicleId)}, { $set: {status: "rented"} }, function(err, response) {
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