/*
index.js
864163
*/


const engines = require('consolidate');
const express = require('express');
const app = express();
const port = process.env.PORT;
const fs = require('fs');
const key = fs.readFileSync('./localhost-key.pem');
const cert = fs.readFileSync('./localhost.pem');
const {auth} = require('express-openid-connect');
const routes = require('./routes.js');

// Auth0 config
// TODO: setup additional fields during registration (?)

const config = {
    required: false,
    auth0Logout: true,
    baseURL: "http://localhost:3000",
    issuerBaseURL: "https://dev-088ewgr5.eu.auth0.com",
    clientID: "3z4bJHQa2RdlzUn4P9JVrCTCOpRI06kU",
    appSessionSecret: "a long, randomly-generated string stored in env"
  };

// auth0 router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Setup htmling template engine
app.set('views', __dirname + '/views');
app.engine('html', engines.htmling);
app.set('view engine', 'html');

// Serve static files in /public
app.use(express.static('public'));

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