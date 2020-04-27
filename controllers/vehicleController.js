const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary')
const formData = require('express-form-data')
const db = require('../lib/db');
const collection = "vehicles";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

router.use(formData.parse())

router.get('/view_all', (req, res) => {
  db.getDB().collection(collection).find({}).toArray((err, documents) => {
    if (err) throw err;
    res.json(documents);
  });
})

router.get('/view_all/:user_id', (req, res) => {
  db.getDB().collection(collection).find({userId : req.params.user_id}).toArray((err, documents) => {
    if (err) throw err;
    res.json(documents);
  });
})

router.get('/view_one/:vehicle_id', (req, res) => {
  db.getDB().collection(collection).find(db.getPrimaryKey(req.params.vehicle_id)).toArray((err, documents) => {
    if (err) throw err;
    res.json(documents);
  });
})

router.post('/image_upload', (req, res) => {

  const values = Object.values(req.files)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))
  
  Promise
    .all(promises)
    .then(results => res.json(results))
})

router.post('/add', function (req, res, next) {
  var usrObj = req.body;

  // jwt.verify(usrObj.token,'supersecret', function(err, decoded){
  //   if(err){
  //     res.send({
  //       error: err,
  //       message: "Failed to authorize user"
  //     });
  //   }
  // });

  // delete usrObj.token;
  
  db.getDB().collection(collection).insertOne(usrObj, function(err, response) {
    if (err) {
      res.send({
        error: err,
        message: "Failed to add vehicle"
      });
    } else {
      res.send({
        error: false,
        message: "Successfully added vehicle"
      });
    }
  });
});

router.put('/edit/:vehicle_id', function (req, res, next) {
  var usrObj = req.body;

  jwt.verify(usrObj.token,'supersecret', function(err, decoded){
    if(err){
      res.send({
        error: true,
        message: "Failed to update vehicle"
      });
    }
  });

  delete usrObj.token;

  console.log(usrObj);
  db.getDB().collection(collection).updateOne({_id: db.getPrimaryKey(req.params.vehicle_id)}, { $set: usrObj }, function(err, response) {
    if (err) {
      res.send({
        error: true,
        message: "Failed to updated vehicle"
      });
    } else {
      res.send({
        error: false,
        message: "Successfully updated vehicle"
      });
    }
  });
});

// Route for search
router.post("/search", function(req, res, next) {
  var query = req.body;
  console.log(query);

  // jwt.verify(query.token,'supersecret', function(err, decoded){
  //   if(err){
  //     res.send({
  //       error: true,
  //       message: "Failed to update vehicle"
  //     });
  //   }
  // });

  db.getDB().collection(collection).find({ location : query.location }).toArray((err, documents) => {
    if (err) throw err;
    res.send(documents);
  });

});

module.exports = router;