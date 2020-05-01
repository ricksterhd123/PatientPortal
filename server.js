const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const userModel = require('./libs/models/user');
const validator = require('./libs/validators');
const routes = require('./libs/routes');
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
app.use(async function (req, res, next) => {
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
app.get('*', async function (req, res, next) {
  if (req.url === '/login' || req.url === '/register' || req.url === '/api/login' || req.url === '/api/register') {
    next();
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
app.post('/api/login', async function login(req, res){
  let auth = req.header('authorization').replace("Basic", "");
  let decoded = Buffer.from(auth, 'base64').toString();
  let [username, password] = decoded.split(":");
  let user = new userModel.user(username);

  let docs = await userModel.getUser(_, client, user).catch(() => {res.JSON.stringify({success:false})});
  if (docs) {
    if (docs.length < 1) {
      console.log("Incorrect");
      res.send(JSON.stringify({
        success: false
      }));
    } else {
      assert.equal(docs.length, 1); // Shouldn't be more than 1 
      let hash = docs[0].Password;
      console.log(`Hash: ${hash}`);
      let result = await bcrypt.compare(password, hash);
      if (result) {
        if (result) {
          res.cookie('jwt', jwt.sign({ username: username }, secret), { httpOnly: true });
        }
        res.send(JSON.stringify({ success: result }));
      }
    }
  }

});

app.post("/api/register", async function (req, res) {
  var token = req.token;
  if (!token) {
    let username = req.body.username;
    let password = req.body.password;
    if (validator.username(username) && validator.password(password)) {
      let salt = await bcrypt.genSalt(saltRounds).catch((err) => {
        console.error(err);
        res.send(JSON.stringify({success:false}))
      });

      let hash = await bcrypt.hash(password, salt).catch((err) => {
        console.error(err);
        res.send(JSON.stringify({success: false}));
      });

      let user = new userModel.user(_, username, hash);
      let success = await userModel.createUser(client, user).catch((success) => {
        console.error("Could not create user because it exists");
        res.send(JSON.stringify({success: false}));
      });

      if (success) {
        let token = jwt.sign({ username: user.username }, secret);
        if (token) {
          res.cookie('jwt', token, { httpOnly: true });
        }
      }
      res.send(JSON.stringify({ success: success }));

    } else {
      res.send(JSON.stringify({success: false}));
    }
  } else {
    res.send(JSON.stringify({ success: false }));
  }
});

// GET /api/logout - removes jwt httponly cookie from browser then redirects to index
app.get("/api/logout", async function (req, res) {
  res.clearCookie('jwt');
  res.redirect("/");
});



for (let [key, value] of Object.entries(routes)) {
  app.get(key, value);
}

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
