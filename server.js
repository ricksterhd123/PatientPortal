const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const assert = require('assert');
const userModel = require('./libs/models/user');
const validator = require('./libs/validators');
const routes = require('./libs/routes');
const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;  // bcrypt salt rounds
const secret = "shhhh"; // JWT secret (temporary until i figure out how to create HMAC SHA256 key)


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
app.use(async function (req, res, next) {
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
app.post('/api/login', async function (req, res){
  let auth = req.header('authorization').replace("Basic", "");
  let decoded = Buffer.from(auth, 'base64').toString();
  let [username, password] = decoded.split(":");
  let user = new userModel.user(null, username);
  let docs = await userModel.getUser(user).catch((err) => {
    console.error(err);
  });

  if (docs) {
    if (docs.length < 1) {
      res.send(JSON.stringify({
        success: false, error: "Invalid username or password"
      }));
    } else {
      assert.equal(docs.length, 1); // Shouldn't be more than 1 
      let hash = docs[0].Password;
      console.log(`Hash: ${hash}`);
      let result = await bcrypt.compare(password, hash);
        if (result) {
          res.cookie('jwt', jwt.sign({ username: username }, secret), { httpOnly: true });
        }
        res.send(JSON.stringify({ success: result, error: result ? null : "Invalid username or password..." }));
    }
  } else {
    res.send(JSON.stringify({success: false, error: "Error: come back later..."}));
  }

});

app.post("/api/register", async function (req, res) {
  var token = req.token;
  if (!token) {
    let username = req.body.username;
    let password = req.body.password;
    let valid = validator.username(username) && validator.password(password);

    if (valid) {
      let salt = await bcrypt.genSalt(saltRounds).catch((err) => {
        console.error(err);
        res.send(JSON.stringify({success:false, error: "Come back again later..."}))
      });

      if (salt) {
        let hash = await bcrypt.hash(password, salt).catch((err) => {
          console.error(err);
          res.send(JSON.stringify({success: false, error: "Come back again later..."}));
        });
        
        if (hash) {
          let user = new userModel.user(null, username, hash);
          let success = await userModel.createUser(user).catch((err) => {
            console.error(err);
          });

          if (success) {
            let token = jwt.sign({ username: user.username }, secret);
            if (token) {
              res.cookie('jwt', token, { httpOnly: true });
            }
          }
          res.send(JSON.stringify({ success: success, error: success ? null : "Failed to register, please try a different username"}));
        }
      }

    } else {
      res.send(JSON.stringify({success: false, error: "Username must be alphanumeric characters only and password must be at least 5 characters in length"}));
    }
  } else {
    res.send(JSON.stringify({ success: false, error: "Already logged in" }));
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
