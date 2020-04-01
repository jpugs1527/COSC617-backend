const express = require("express");
const axios = require("axios");
const router = express.Router();

/* GET index page. */
router.get('/', function (req, res, next) {
  res.send("Hello User");
});

module.exports = router;