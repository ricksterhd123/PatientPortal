/*
index.js
864163
*/

const engines = require('consolidate');
const express = require('express');
const app = express();
const port = process.env.PORT;
const routes = require('./routes.js');

// Setup htmling template engine
app.set('views', __dirname + '/views');
app.engine('html', engines.htmling);
app.set('view engine', 'html');

// Serve static files in /public
app.use(express.static('public'));

// Middleware test
app.post('/login', (req, res, next) => {
  var auth = req.header('authorization').replace("Basic", "");
  var decoded = Buffer.from(auth, 'base64').toString();
  console.log(decoded);
  var [user, pass] = decoded.split(":");
  console.log(`User: ${user}, Password: ${pass}`);
  next();
});

// Web pages
// TODO: make API once database is connected
let r = {
  "/": routes.index,
  "/appointments": routes.appointments,
  "/contact": routes.contact,
  "/symptoms": routes.symptoms,
  "/settings": routes.settings,
  "/callback": routes.callback
};

for (let [key, value] of Object.entries(r)){
  app.get(key, value);
}

// Setup server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));