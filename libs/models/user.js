const mongo = require('./mongo');
const assert = require('assert');
const dbName = "PatientPortal";
const collectionName = "Users";


/**
 * User document object structure from database
 */
class user {
    constructor(user, username, password, options) {
        if (!this.user){
            this.username = "" || username;
            this.password = "" || password;
            this.options = {} || options;
        } else {
            this.username = user.username;
            this.password = user.password;
            this.options = user.options;
        }
    }
}

/**
 * Create a user if not exists, callback returns false if it exists otherwise true if it's created.
 * @param {*} mongoClient - MongoClient object
 * @param {*} user - user object
 * @param {*} callback - function callback(success: bool)
 */
function createUser(user) {
    return new Promise(async function (resolve, reject) {
        // Check no other users exist with the same username
        let docs = await getUser(user).catch((err) => {
            reject(err);
        });

        if (docs.length < 1) {
            let client = await mongo.client.connect(mongo.URL, mongo.options).catch((err) => {
                reject(err);
            });
            let db = client.db(dbName);
            // Get the documents collection
            let = collection = db.collection(collectionName);
            let result = await collection.insertOne({ Username: user.username, Password: user.password, Options: user.options }).catch((err) => {
                reject(err || `Error: Inserted ${r.insertedCount-1} documents instead of 1`);
            });

            if (result.insertedCount == 1) {
                resolve(true);
            } else {
                reject("Inserted more than one documents");
            }
        } else {
            reject(err);
        }
    });
} // => user


/**
 * Get promise which returns user object
 * @param {*} mongoClient 
 * @param {*} user 
 */
function getUser(user) {
    return new Promise(async function (resolve, reject) {
        let client = await mongo.client.connect(mongo.URL, mongo.options).catch((err) => {
            reject(err);
        });
        let db = client.db(dbName);
        // Get the documents collection
        let collection = db.collection(collectionName);
        // Find some documents
        let docs = await collection.find({ Username: user.username }).toArray().catch((err) => {
            reject(err)
        });
        resolve(docs);
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