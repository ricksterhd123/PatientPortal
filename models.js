
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = `mongodb://${process.env.user}:${process.env.pass}@mongo:27017`;

// Database Name
const dbName = 'test';

// Create a new MongoClient
const client = new MongoClient(url);

const findDocuments = function(db, collectionName, query, callback) {
  // Get the documents collection
  const collection = db.collection(collectionName);
  // Find some documents
  collection.find(query).toArray(function(err, docs) {
    assert.equal(err, null);

    callback(docs);
  });
}

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  findDocuments(db, 'wew', {'name': 'Ricky'}, (docs) => {console.log(docs)});
  client.close();
});

class Interface {
    
}
module.exports = Interface;