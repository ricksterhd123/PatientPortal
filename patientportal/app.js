const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

// Libs
const JWTReader = require('./middleware/JWTReader');

const api = require('./routes/').api;
const views = require('./routes/').views;

// Setup
const app = express();

// Setup pug template engine
app.set('views', path.join(__dirname, 'views'))
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
app.use(express.static(path.join(__dirname, 'public')));

// Reads JWT and set it to req.token
app.use(JWTReader);

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

// REST API routes
app.use('/api/login', api.auth.login);
app.use("/api/register", api.auth.register);
app.use("/api/logout", api.auth.logout);
app.use("/api/messages/contacts", api.messages.contacts);

// app.get("/api/messages", function(req, res) {
//   if (req.token) {
//     res.send({result: {
//         messages: [ 
//           {id:0, text: "Hello world"}, 
//           {id:1, text: "Wew"}, 
//           {id:2, text: "OMG!"}
//         ]
//       }
//     });
//   }
// });

// VIEWS

app.use('/', views.index);
app.use('/login', views.login);
app.use('/register', views.register);
app.use('/appointments', views.appointments);
app.use('/contact', views.messages);
app.use('/symptoms', views.symptoms);
app.use('/settings', views.settings);

module.exports = app;