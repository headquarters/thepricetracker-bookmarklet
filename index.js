const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('./dist'));

app.get('/', function (req, res) {
  const bookmarklet = fs.readFileSync('./dist/bookmarklet.js');

  res.send(`
    <!doctype html>
    <html lang="en">
    <head>
      <title>Bookmarklet Test Page</title>
      <link rel="stylesheet" href="bookmarklet.css" />
    </head>
    <body>
      <main></main>
      <a href="${bookmarklet}">Open Bookmarklet</a>
      <script src="PriceTracker.js"></script>
    </body>  
    </html>
  `);
})

app.listen(3000, function () {
  console.log('Sample page available at localhost:3000')
})