var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, '/src')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/src/index.html'));
});

app.listen(1919, () => {
  console.log('Active server, the application should be available at: http://localhost:1919');
});
