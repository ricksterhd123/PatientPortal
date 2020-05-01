const client = require('mongodb').MongoClient;
const hostName = process.env.DEBUG == "true" ? "localhost" : "mongo";
const URL = `mongodb://${process.env.user}:${process.env.pass}@${hostName}:27017`;
const options = {useUnifiedTopology: true};
module.exports = {client, URL, options};