const client = require('mongodb').MongoClient;
console.log(process.env.DEBUG);
const hostName = process.env.DEBUG == "true" ? "localhost" : "mongo";
const URL = `mongodb://${process.env.user}:${process.env.pass}@${hostName}:27017`;
console.log(`URL: ${URL}`);
const options = {useUnifiedTopology: true};
module.exports = {client, URL, options};