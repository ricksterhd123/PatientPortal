/*
index.js
864163
*/

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const engines = require('consolidate');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const model = require('./models');
const app = express();
const port = process.env.PORT || 3000;

// Attempt to find SSL certificate for https
// if no SSl certificates found then use http

var certsFound = true;
var privateKey = null;
var cert = null;

try {
  privateKey = fs.readFileSync('./ssl/privkey.pem');
  cert = fs.readFileSync('./ssl/fullchain.pem');
} catch (err) {
  if (err.code === 'ENOENT') {
    certsFound = false;
  } else {
    throw err;
  }
}

const secret = "shhhh"; // JWT secret (temporary until i figure out how to create HMAC SHA256 key)

// Setup cookie parser for HttpOnly cookies
app.use(cookieParser());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
// Parse application/json
app.use(bodyParser.json());
// Setup htmling template engine
app.set('views', __dirname + '/views');
app.engine('html', engines.htmling);
app.set('view engine', 'html');

// Serve static files in /public
app.use(express.static('public'));

/*
  POST /login
  Basic authentication => JSON web token
*/
app.post('/login', (req, res) => {
  let auth = req.header('authorization').replace("Basic", "");
  let decoded = Buffer.from(auth, 'base64').toString();
  let [user, pass] = decoded.split(":");
  let db = new model();
  db.find("PatientPortal", "Users", {Username: user, Password: pass}, (docs) => {
    if (docs.length < 1) {
      console.log("Incorrect");
      res.send(JSON.stringify({
        success: false
      }));
    } else if (docs[0].Username == user && docs[0].Password == pass) {
      console.log(docs);
      console.log("Correct!");
      let token = jwt.sign({
        user: user
      }, secret);
      res.cookie('jwt', token, {
        httpOnly: true
      });
      res.send(JSON.stringify({
        success: true
      }));
      console.log("Generated token: " + token);
      console.log(`User: ${user}, Password: ${pass}`);
    } else {
      res.send(JSON.stringify({
        success: false
      }));
    }
  });
});

// Routes which render views
const routes = {};

// req.isAuthenticated is provided from the auth router
routes.index = function (req, res) {
  let token = req.cookies.jwt
  if (token) {
    let valid = jwt.verify(token, secret);
    if (valid) {
      console.log(valid.user);
      res.render('home.html', {name: valid.user});
    }
  } else {
    res.render('login.html');
  }
}

routes.appointments = function (req, res) {
  res.render('appointments.html');
}

routes.contact = function (req, res) {
  res.render('contact.html');
}

routes.symptoms = function (req, res) {
  res.render("symptoms.html");
}

routes.settings = function (req, res) {
  res.render("settings.html");
}

// Not sure exactly what this does yet...
routes.callback = function (req, res) {
  res.redirect("/home");
  console.log(req);
}

routes.logout = function (req, res) {
  res.clearCookie('jwt');
  res.redirect("/");
}

// Bind each route to a callback function
const r = {
  "/": routes.index,
  "/appointments": routes.appointments,
  "/contact": routes.contact,
  "/symptoms": routes.symptoms,
  "/settings": routes.settings,
  "/callback": routes.callback,
  "/logout": routes.logout,
};

for (let [key, value] of Object.entries(r)) {
  app.get(key, value);
}

// Now serve https or http depending on certsFound
if (!certsFound) {
  app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
} else {
  https.createServer({key: privateKey, cert: cert}, app).listen(port, () => console.log(`Listening at https://localhost:${port}!`));
}
