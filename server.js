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

app.use((req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    let valid = jwt.verify(token, secret);
    if (valid){
      req.token = valid;
    }
  }

  next();
});

/* Redirect user to /login if they've not logged in yet */
app.get('*', function(req, res, next) {
  if (req.url === '/login' || req.url === '/register' || req.url === '/api/login' || req.url === '/api/register') {
    return next();
  } else {
    if (req.token) {
      next();
    } else {
      res.redirect('/login');
    }
  }
});

/*
  POST /api/login
  Basic authentication => JSON web token
*/
app.post('/api/login', (req, res) => {
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
  let token = req.token;
  res.render('home.html', {name: token.user});
}

routes.login = function(req, res) {
  res.render('login.html');
}

routes.register = function(req, res) {
  res.send("Hello world!");
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
  "/login": routes.login,
  "/register": routes.register,
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

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
