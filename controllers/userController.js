const express = require("express");
const axios = require("axios");
const router = express.Router();

/* Return all users in the db. */
router.get('/all', function (req, res, next) {
  res.send("Hellasddo Uhsefr");
});

// Create a new user
router.post('/new', function (req, res, next) {
  
});

module.exports = router;