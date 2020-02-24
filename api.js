var express = require('express');
var app = express();

var port = process.argv[2];

app.get('/api/parsetime', (req, res) => {
  var date = new Date(req.query.iso);
  var hour = date.getHours();
  var minute = date.getMinutes();
  var seconds = date.getSeconds();
  var json = {
    "hour": hour,
    "minute": minute,
    "second": seconds
  }
  res.status(200).json(json);
});

app.get('/api/unixtime', (req, res) => {
  var date = new Date(req.query.iso);
  var milliseconds = date.getTime();
  var json = {
    "unixtime": milliseconds
  }
  res.status(200).json(json);
});

app.get('/*', (req, res) => {
  res.status(404).send('Page Not Found');
});

console.log("App runnning at localhost:" + port);

app.listen(port);
