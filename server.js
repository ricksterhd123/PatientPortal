/*
index.js
864163
*/

// Imports
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const engines = require('consolidate');
const routes = require('./routes.js');
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = express();
const port = process.env.PORT || 3000;
const secret = "shhhh"; // JWT secret (temporary until i figure out how to create HMAC SHA256 key)

// Connection URL
let url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});

let store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
  collection: 'mySessions'
})

store.on('error', (error) => console.log(error));
app.use(session({
  secret: 'this is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

// Setup htmling template engine
app.set('views', __dirname + '/views');
app.engine('html', engines.htmling);
app.set('view engine', 'html');

// Serve static files in /public
app.use(express.static('public'));

// Middleware test
app.post('/login', (req, res, next) => {
  let auth = req.header('authorization').replace("Basic", "");
  let decoded = Buffer.from(auth, 'base64').toString();
  let [user, pass] = decoded.split(":");

  if (user == "user" && pass == "password") {
    let token = jwt.sign({
      foo: 'bar'
    }, secret);
    res.setHeader('Set-Cookie', `jwt=${token}`);
  }
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

for (let [key, value] of Object.entries(r)) {
  app.get(key, value);
}

// Setup server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));