const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('./dist'))

app.get('/', function (req, res) {
  const bookmarklet = fs.readFileSync('./dist/bookmarklet.js');

  res.sendFile(path.join(__dirname, 'views/index.html'));
})

app.listen(3000, function () {
  console.log('Sample page available at localhost:3000')
})