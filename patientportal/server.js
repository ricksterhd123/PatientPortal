const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

// Libs
const userModel = require('./libs/models/user');
const validator = require('./libs/validators');
const routes = require('./libs/routes');
const roles = require('./libs/roles');

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10; // bcrypt salt rounds
const secret = "shhhh"; // JWT secret (temporary until i figure out how to create HMAC SHA256 key)

// Setup pug template engine
app.set('view engine', 'pug');
// Setup cookie parser for HttpOnly cookies
app.use(cookieParser());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
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

/**
  POST /api/login
  Basic authentication => JSON web token
 */
app.post('/api/login', async function (req, res) {
  let auth = req.header('authorization').replace("Basic", "");
  let decoded = Buffer.from(auth, 'base64').toString();
  let [username, password] = decoded.split(":");
  var user = new userModel.User(null, username);
  user = await userModel.getUser(user).catch(console.trace(err));

  if (user) {
    let hash = user.password;
    let result = await bcrypt.compare(password, hash);

    if (result) {
      res.cookie('jwt', jwt.sign({
        username: username
      }, secret), {
        httpOnly: true
      });
    }

    res.send(JSON.stringify({
      success: result,
      error: result ? null : "Invalid username or password..."
    }));
  } else {
    res.send(JSON.stringify({
      success: false,
      error: "Invalid username or password..."
    }));
  }
});

/**
 * POST /api/register
 * Content-type: json/application 
 * example: 
 * req.body = {
 *    username: "username",
 *    password: "password"
 * }
 */
app.post("/api/register", async function (req, res) {
  var token = req.token;
  if (!token) {
    let username = req.body.username;
    let password = req.body.password;
    let valid = validator.username(username) && validator.password(password);

    if (valid) {
      let salt = await bcrypt.genSalt(saltRounds).catch((err) => {
        console.trace(err);
        res.send(JSON.stringify({
          success: false,
          error: "Come back again later..."
        }))
      });

      if (salt) {
        let hash = await bcrypt.hash(password, salt).catch((err) => {
          console.trace(err);
          res.send(JSON.stringify({
            success: false,
            error: "Come back again later..."
          }));
        });

        if (hash) {
          let count = await userModel.getNumberOfUsers().catch(console.trace);
          
          let role = roles.USER;
          if (count == 0) {
            role = roles.ADMIN;
          }

          let user = new userModel.User(null, username, hash, {role: role});
          var success = await userModel.createUser(user).catch(console.trace);

          if (success) {
            let token = jwt.sign({
              username: user.username
            }, secret);

            if (token) {
              res.cookie('jwt', token, {
                httpOnly: true
              });

            } else {
              console.trace("Could not create token");
              success = false;
            }
          }

          res.send(JSON.stringify({
            success: success,
            error: success ? null : "Failed to register, please try a different username"
          }));
        }
      }

    } else {
      res.send(JSON.stringify({
        success: false,
        error: "Username must be alphanumeric characters only and password must be at least 5 characters in length"
      }));
    }
  } else {
    res.send(JSON.stringify({
      success: false,
      error: "Already logged in"
    }));
  }
});

// GET /api/logout - removes jwt httponly cookie from browser then redirects to index
app.get("/api/logout", async function (req, res) {
  res.clearCookie('jwt');
  res.redirect("/");
});

// GET routes
for (let [key, value] of Object.entries(routes)) {
  app.get(key, value);
}

// Start server
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));