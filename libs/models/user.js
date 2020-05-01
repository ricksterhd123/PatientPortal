const mongo = require('./mongo');
const assert = require('assert');
const dbName = "PatientPortal";
const collectionName = "Users";


/**
 * User document object structure from database
 */
class User {
    constructor(user, username, password, options) {
        if (!user) {
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
 * Create a user if not exists and returns promise.
 * @param {*} user - user object
 * @returns Promise
 */
function createUser(user) {
    return new Promise(async function (resolve, reject) {
        // Check no other users exist with the same username
        let userExists = await getUser(user).catch((err) => {
            reject(err);
        });

        if (!userExists) {
            let client = await mongo.client.connect(mongo.URL, mongo.options).catch((err) => {
                reject(err);
            });
            let db = client.db(dbName);
            // Get the documents collection
            let = collection = db.collection(collectionName);
            let result = await collection.insertOne({
                username: user.username,
                password: user.password,
                options: user.options
            }).catch((err) => {
                reject(err || `Error: Inserted ${r.insertedCount-1} documents instead of 1`);
            });

            // resolve new User ??
            if (result.insertedCount == 1) {
                resolve(true);
            } else {
                reject("Inserted more than one documents");
            }
        } else {
            reject("Failed to register please try a different username");
        }
    });
} // => user

/**
 * Find user returns promise,
 * note: resolve given false is no user is found
 * @param {*} user - A user object, needs at least a username
 * @returns Promise 
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
        let docs = await collection.find({
            username: user.username
        }).toArray().catch((err) => {
            reject(err)
        });
        if (docs.length == 1){
            resolve(new User(docs[0]));
        } else {
            resolve(false);
        }
    });
} // => user

function updateUser(user) {} // => bool

function deleteUser(user) {} // => bool

module.exports = {
    User,
    createUser,
    getUser
};