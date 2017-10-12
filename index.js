const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', function (req, res) {
  const bookmarklet = fs.readFileSync('./dist/bookmarklet.js');

  res.send(
    `<!doctype html>
      <html lang="en">
      <head>
        <title>Bookmarklet Test Page</title>
      </head>
      <body>
        
        <a href="${bookmarklet}">Open Bookmarklet</a>
      </body>  
    </html>`
  );
})

app.listen(3000, function () {
  console.log('Sample page available at localhost:3000')
})