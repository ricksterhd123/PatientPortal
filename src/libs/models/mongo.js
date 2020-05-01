const client = require('mongodb').MongoClient;
const URL = `mongodb://${process.env.user}:${process.env.pass}@mongo:27017`;
const options = {useUnifiedTopology: true};

module.exports = {client, URL, options};