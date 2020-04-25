/*
index.js
864163
*/

const express = require('express');
const engines = require('consolidate');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const app = express();
const port = process.env.PORT || 3000;
const secret = "shhhh"; // JWT secret (temporary until i figure out how to create HMAC SHA256 key)

app.use(cookieParser());
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

  let token = jwt.sign({
    user: user
  }, secret);

  res.cookie('jwt', token, {httpOnly: true});
  res.send(JSON.stringify({success:true}));

  console.log("Generated token: " + token);
  console.log(`User: ${user}, Password: ${pass}`);
  next();
});

// Routes
let routes = {};

// req.isAuthenticated is provided from the auth router
routes.index = function (req, res) {
  let token = req.cookies.jwt
  if (token) {
    let valid = jwt.verify(token, secret);
    if (valid) {
      console.log(valid.user);
      res.render('home.html');
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

routes.logout = function(req, res) {
  res.clearCookie('jwt');
  res.redirect("/");
}
// End of routes
// Web pages
// TODO: make API once database is connected
let r = {
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

// Setup server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));