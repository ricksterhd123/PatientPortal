/* jshint esversion: 6 */
const assert = require('assert');
const dbName = "PatientPortal";
const collectionName = "Users";

class user {
    constructor(username, password, options) {
        this.username = "" || username;
        this.password = "" || password;
        this.options  = {} || options;
    }
}

/**
 * Create a user if not exists, callback returns false if it exists otherwise true if it's created.
 * @param {*} mongoClient - MongoClient object
 * @param {*} user - user object
 * @param {*} callback - function callback(success: bool)
 */
function createUser(mongoClient, user, callback) {
    getUser(mongoClient, user, (docs) => {
        if (docs.length <= 0) {
            mongoClient.connect((err) => {
                assert.equal(null, err);
                const db = mongoClient.db(dbName);
                // Get the documents collection
                const collection = db.collection(collectionName);
                collection.insertOne({Username: user.username, Password: user.password, Options: user.options}, (err, r) => {
                    assert.equal(null, err);
                    assert.equal(1, r.insertedCount);
                    callback(true);
                });
            });
        } else {
            callback(false);
        }
    });
} // => user

/**
 * Get user object from callback
 * @param {*} mongoClient 
 * @param {*} user 
 * @param {*} callback 
 */
function getUser(mongoClient, user, callback) {
    mongoClient.connect((err) => {
        assert.equal(null, err);
        const db = mongoClient.db(dbName);
        // Get the documents collection
        const collection = db.collection(collectionName);
        // Find some documents
        collection.find({Username: user.username}).toArray((err, docs) => {
          assert.equal(err, null);
          callback(docs);
        });
    });
} // => user

function updateUser(user) {
} // => bool

function deleteUser(user) {
} // => bool

module.exports = {
    user,
    createUser,
    getUser
};