const mongo = require('./mongo');
const assert = require('assert');
const dbName = "PatientPortal";
const collectionName = "Messages";

/**
 * Create a user if not exists and returns promise.
 * @param {*} user - user object
 * @returns Promise
 */
function sendMessage(fromUser, toUser, timeStamp, message) {
    return new Promise(async function (resolve, reject) {
        let client = await mongo.client.connect(mongo.URL, mongo.options).catch(reject);
        let db = client.db(dbName);
        // Get the documents collection
        let = collection = db.collection(collectionName);
        let result = await collection.insertOne({
            fromUser: fromUser,
            toUser: toUser,
            timeStamp: timeStamp,
            message: message
        }).catch((err) => {
            reject(err || `Error: Inserted ${r.insertedCount-1} documents instead of 1`);
        });
        if (result.insertedCount == 1) {
            resolve(true);
        } else {
            reject("Inserted more than one documents");
        }
    });
} // => bool

/**
 * Returns promise to find list of userID contacats
 * note: resolve given false is no user is found
 * @param {string} userID - A string userID
 * @returns Promise 
 */
function getRecentContacts(userID) {
    return new Promise(async function (resolve, reject) {
        let client = await mongo.client.connect(mongo.URL, mongo.options).catch(reject);
        let db = client.db(dbName);
        // Get the documents collection
        let collection = db.collection(collectionName);
        // Find some documents
        let sent = await collection.find({fromUser: userID}).toArray().catch(reject);
        let inbox = await collection.find({toUser: userID }).toArray().catch(reject);
        let contacts = [];

        if (sent && sent.length > 0) {
            sent.foreach((message) => {
                if (contacts.indexOf(message.toUser) == -1) {
                    contacts.push(message.toUser);
                }
            });
        }

        if (inbox && inbox.length > 0) {
            inbox.foreach((message) => {
                if (contacts.indexOf(message.fromUser) == -1) {
                    contacts.push(message.fromUser);
                }
            });
        }

        resolve(contacts);
    });
}

function getNumberOfMessages() {
    return new Promise(async function (resolve, reject) {
        let client = await mongo.client.connect(mongo.URL, mongo.options).catch(reject);
        let db = client.db(dbName);
        let collection = db.collection(collectionName);
        let docs = await collection.find({}).toArray().catch(reject);
        resolve(docs.length);
    });
}

function updateMessage(user) {} // => bool

function deleteMessage(user) {} // => bool

module.exports = {sendMessage, getRecentContacts, getNumberOfMessages};
