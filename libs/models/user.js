/* jshint esversion: 8 */
const assert = require('assert');
const dbName = "PatientPortal";
const collectionName = "Users";

class user {
    constructor(username, password, options) {
        this.username = "" || username;
        this.password = "" || password;
        this.options = {} || options;
    }
}

/**
 * Create a user if not exists, callback returns false if it exists otherwise true if it's created.
 * @param {*} mongoClient - MongoClient object
 * @param {*} user - user object
 * @param {*} callback - function callback(success: bool)
 */
function createUser(mongoClient, user) {
    return new Promise((resolve, reject) => {
        getUser(mongoClient, user).then((docs) => {
            if (docs.length <= 0) {
                mongoClient.connect((err) => {
                    if (!err) {
                        const db = mongoClient.db(dbName);
                        // Get the documents collection
                        const collection = db.collection(collectionName);
                        collection.insertOne({ Username: user.username, Password: user.password, Options: user.options }, (err, r) => {
                            if (!err && r.insertedCount == 1) {
                                resolve(true);
                            } else {
                                reject(err || `Error: Inserted ${r.insertedCount-1} documents instead of 1`);
                            }
                        });
                    } else {
                        reject(err);
                    }
                });
            } else {
                reject(false);
            }
        }).catch(reject);
    });
} // => user


/**
 * Get promise which returns user object
 * @param {*} mongoClient 
 * @param {*} user 
 */
function getUser(mongoClient, user) {
    return new Promise((resolve, reject) => {
        let mongoPromise = new Promise((resolve, reject) => {
            mongoClient.connect((err) => {
                if (!err) { 
                    const db = mongoClient.db(dbName);
                    // Get the documents collection
                    const collection = db.collection(collectionName);
                    // Find some documents
                    collection.find({ Username: user.username }).toArray((err, docs) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(docs);
                        }
                    });
                } else {
                    reject(err);
                }
            });
        });
        mongoPromise.then(resolve).catch(reject);
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