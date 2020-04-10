/*
index.js
864163
*/

// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

// // Connection URL
// const url = 'mongodb://mongo:27017';

// // Database Name
// const dbName = 'myproject';

// // Create a new MongoClient
// const client = new MongoClient(url);

// // Use connect method to connect to the Server
// client.connect(function(err) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   client.close();
// });

let engines = require('consolidate');
const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const key = fs.readFileSync('./localhost-key.pem');
const cert = fs.readFileSync('./localhost.pem');

app.set('views', __dirname + '/views');
app.engine('html', engines.htmling);
app.set('view engine', 'html');

// Static files inside /public folder
app.use(express.static('public'));

// Routes
// Index /GET
app.get('/', (req, res) => res.render('index.html'));
app.get('/home', (req, res) => res.render('home.html'));
app.get('/appointments', (req, res) => res.render('appointments.html'));
app.get('/contact', (req, res) => res.render('contact.html'));
app.get('/symptoms', (req, res) => res.render("symptoms.html"));
app.get('/settings', (req, res) => res.render('settings.html'))

app.get('/login', (req, res) => res.redirect("/home"));
app.get('/logout', (req, res) => res.redirect('/'));

// Setup server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));