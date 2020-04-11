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

router.post('/image_upload', (req, res) => {

  const values = Object.values(req.files)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))
  
  Promise
    .all(promises)
    .then(results => res.json(results))
})

router.post('/add', function (req, res, next) {
  var usrObj = req.body;

  jwt.verify(usrObj.token,'supersecret', function(err, decoded){
    if(err){
      res.send({
        error: true,
        message: "Failed to add vehicle"
      });
    }
  });

  delete usrObj.token;
  
  db.getDB().collection(collection).insertOne(usrObj, function(err, response) {
    if (err) {
      res.send({
        error: true,
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

module.exports = router;