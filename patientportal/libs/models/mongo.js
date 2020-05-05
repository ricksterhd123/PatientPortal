let DEBUG = process.env.DEBUG == "true";
const hostName = DEBUG ? "localhost" : "mongo";
const URL = `mongodb://${process.env.user}:${process.env.pass}@${hostName}:27017`;
const client = require('mongodb').MongoClient;
console.log(`URL: ${URL}`);
const options = {useUnifiedTopology: true};
module.exports = {client, URL, options};