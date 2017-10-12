const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('./dist'));

app.get('/', function (req, res) {
  const bookmarklet = fs.readFileSync('./dist/PriceTrackerBookmarklet.js');

  res.send(`
    <!doctype html>
    <html lang="en">
    <head>
      <title>Bookmarklet Test Page</title>
    </head>
    <body>
      <p>
        The bookmarklet runs automatically on page load as an included script tag at the end of the document, since
        it's an immediately-invoked function expression (IIFE). You can also click <a href="${bookmarklet}">Open Bookmarklet</a> 
        to invoke the bookmarklet if you close it. 
      </p>
      <div>A sample price: <span class="price">$99.99</span></div>
      <script src="PriceTracker.js"></script>
    </body>  
    </html>
  `);
})

app.listen(3000, function () {
  console.log('Sample page available at localhost:3000')
})