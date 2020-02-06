/*
index.js
864163
*/
const DEBUG = process.env.DEBUG || false;
const express = require('express');
const app = express();
const port = DEBUG ? 5000 : 80;

// Static files inside /public folder
app.use(express.static('public'));

// Routes
// Index /GET
app.get('/', (req, res) => res.render('public/index.html'));

// Setup server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));