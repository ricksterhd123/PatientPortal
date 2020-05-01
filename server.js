/*jshint esversion: 8*/

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const userModel = require('./libs/models/user');
const validator = require('./libs/validators');

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;  // bcrypt salt rounds
const secret = "shhhh"; // JWT secret (temporary until i figure out how to create HMAC SHA256 key)
const client = new MongoClient(`mongodb://${process.env.user}:${process.env.pass}@mongo:27017`, { useUnifiedTopology: true });

// Setup pug template engine
app.set('view engine', 'pug');
// Setup cookie parser for HttpOnly cookies
app.use(cookieParser());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Serve static files in /public
app.use(express.static('public'));

// Middleware to verify if the jwt token is valid
app.use((req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    let valid = jwt.verify(token, secret);
    if (valid) {
      req.token = valid;
    }
  }

  next();
});

// Redirect user to /login if they've not logged in yet
app.get('*', function (req, res, next) {
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
  let [username, password] = decoded.split(":");

  let user = new userModel.user(username);
  userModel.getUser(client, user, (docs) => {
    if (docs.length < 1) {
      console.log("Incorrect");
      res.send(JSON.stringify({
        success: false
      }));
    } else {
      assert.equal(docs.length, 1); // Shouldn't be more than 1 
      let hash = docs[0].Password;
      console.log(`Hash: ${hash}`);
      bcrypt.compare(password, hash, (err, result) => {
        assert.equal(err, null);
        if (result) {
          res.cookie('jwt', jwt.sign({ username: username }, secret), { httpOnly: true });
        }
        res.send(JSON.stringify({ success: result }));
      });
    }
  });
});

app.post("/api/register", function (req, res) {
  var token = req.token;
  if (!token) {
    let username = req.body.username;
    let password = req.body.password;

    bcrypt.genSalt(saltRounds, function (err, salt) {
      assert.equal(err, null);
      bcrypt.hash(password, salt, function (err, hash) {
        assert.equal(err, null);
        let user = new userModel.user(username, hash);
        userModel.createUser(client, user, (success) => {
          if (success) {
            let token = jwt.sign({ username: user.username }, secret);
            if (token) {
              res.cookie('jwt', token, { httpOnly: true });
            }
          }
          res.send(JSON.stringify({ success: success }));
        });
      });
    });

  } else {
    res.send(JSON.stringify({ success: false }));
  }
});

// GET /api/logout - removes jwt httponly cookie from browser then redirects to index
app.get("/api/logout", function (req, res) {
  res.clearCookie('jwt');
  res.redirect("/");
});

// Routes which render views
const routes = {};

// req.isAuthenticated is provided from the auth router
routes.index = function (req, res) {
  let token = req.token;
  res.render('home.pug', { title: "Home", name: token.username });
};

routes.register = function (req, res) {
  let token = req.token;
  if (token) {
    res.redirect('/');
  } else {
    res.render('register.pug', { title: 'register' });
  }
};
routes.login = function (req, res) {
  res.render('login.pug', { title: 'login' });
};

routes.appointments = function (req, res) {
  res.render('appointments.pug');
};

routes.contact = function (req, res) {
  res.render('contact.pug');
};

routes.symptoms = function (req, res) {
  res.render("symptoms.pug");
};

routes.settings = function (req, res) {
  res.render("settings.pug");
};

// Bind each route to a callback function
const r = {
  "/": routes.index,
  "/login": routes.login,
  "/register": routes.register,
  "/appointments": routes.appointments,
  "/contact": routes.contact,
  "/symptoms": routes.symptoms,
  "/settings": routes.settings
};

for (let [key, value] of Object.entries(r)) {
  app.get(key, value);
}

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
