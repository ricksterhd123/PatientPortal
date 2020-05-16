const mongo = require('./mongo');
const ObjectId = require('mongodb').ObjectId;
const dbName = "PatientPortal";
const collectionName = "Users";

/**
 * Create a user if not exists and returns promise.
 * @param {*} user - user object
 * @returns Promise
 */
function createUser(username, password, options) {
    return new Promise(async function (resolve, reject) {
        // Check no other users exist with the same username
        let userExists = await getUser(username).catch(reject);

        if (!userExists) {
            let client = await mongo.client.connect(mongo.URL, mongo.options).catch(reject);
            let db = client.db(dbName);
            // Get the documents collection
            let = collection = db.collection(collectionName);
            let result = await collection.insertOne({
                username: username,
                password: password,
                options: options
            }).catch((err) => {
                reject(err || `Error: Inserted ${r.insertedCount-1} documents instead of 1`);
            });

            if (result.insertedCount == 1) {
                resolve(result.insertedId);
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
 * @param {string} username - The username of the user to find.
 * @returns Promise 
 */
function getUser(username) {
    return new Promise(async function (resolve, reject) {
        let client = await mongo.client.connect(mongo.URL, mongo.options).catch(reject);
        let db = client.db(dbName);
        // Get the documents collection
        let collection = db.collection(collectionName);
        // Find some documents
        let docs = await collection.find({
            username: username
        }).toArray().catch(reject);

        if (docs.length == 1){
            resolve(docs[0]);
        } else {
            resolve(false);
        }
    });
}

/**
 * Get a list of all users
 */
function getAllUsers() {
    return new Promise(async function (resolve, reject) {
        let client = await mongo.client.connect(mongo.URL, mongo.options).catch(reject);
        let db = client.db(dbName);
        // Get the documents collection
        let collection = db.collection(collectionName);
        // Find some documents
        let docs = await collection.find({}).toArray().catch(reject);
        resolve(docs);
    });
}

/**
 * Get the user from ID
 * @param {string | ObjectId} id 
 */
function getUserFromID(id) {
    return new Promise(async function (resolve, reject) {
        let client = await mongo.client.connect(mongo.URL, mongo.options).catch(reject);
        let db = client.db(dbName);
        // Get the documents collection
        let collection = db.collection(collectionName);
        // Find some documents
        let docs = await collection.find({
            _id: new ObjectId(id)
        }).toArray().catch(reject);

        if (docs.length == 1){
            resolve(docs[0]);
        } else {
            resolve(false);
        }
    });
}

/**
 * Count number of all users in the system
 */
function getNumberOfUsers() {
    return new Promise(async function (resolve, reject) {
        let client = await mongo.client.connect(mongo.URL, mongo.options).catch(reject);
        let db = client.db(dbName);
        let collection = db.collection(collectionName);
        let docs = await collection.find({}).toArray().catch(reject);
        resolve(docs.length);
    });
} // => number

// function updateUser(user) {} // => bool

// function deleteUser(user) {} // => bool

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    getUserFromID,
    getNumberOfUsers
};