/* jshint esversion: 6 */
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(`mongodb://${process.env.user}:${process.env.pass}@mongo:27017`, { useUnifiedTopology: true });
const assert = require('assert');

class Model {
  find(dbName, collectionName, query, callback) {
    client.connect((err) => {
      assert.equal(null, err);
      console.log("Connected");

      const db = client.db(dbName);
      // Get the documents collection
      const collection = db.collection(collectionName);
      // Find some documents
      collection.find(query).toArray((err, docs) => {
        assert.equal(err, null);
        callback(docs);
      });
    });
  }
}

class User extends Model {
}
module.exports = Model;