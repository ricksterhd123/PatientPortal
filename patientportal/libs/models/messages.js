const mongo = require('./mongo');
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const User = require('./user');
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
            fromUser: new ObjectId(fromUser),
            toUser: new ObjectId(toUser),
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
} 

function getMessagesFromUser(fromUser, toUser) {
    fromUser = new ObjectId(fromUser);
    toUser = new ObjectId(toUser);

    return new Promise(async function (resolve, reject) {
        try {
            let client = await mongo.client.connect(mongo.URL, mongo.options);
            let db = client.db(dbName);
            // Get the documents collection
            let collection = db.collection(collectionName);
            // Find some documents
            let sent = await collection.find({fromUser: fromUser, toUser: toUser}).toArray();
            let recieved = await collection.find({fromUser: toUser, toUser: fromUser}).toArray();
            let messages = sent.concat(recieved);

            for (let i = 0; i < messages.length; i++) {
                let fUser = await User.getUserFromID(messages[i].fromUser);
                let tUser = await User.getUserFromID(messages[i].toUser);
                
                if (!fUser || !tUser) {
                    reject("Could not find user with provided id");
                }

                messages[i].fromUser = fUser.username;
                messages[i].toUser = tUser.username;
            }
            resolve(messages);
        } catch (e) { 
            reject(e);
        };
    });
}

/**
 * Returns promise to find list of userID contacats
 * note: resolve given false is no user is found
 * @param {string} userID - A string userID
 * @returns Promise 
 */
function getRecentContacts(userID) {
    userID = new ObjectId(userID);
    return new Promise(async function (resolve, reject) {
        let client = await mongo.client.connect(mongo.URL, mongo.options).catch(reject);
        let db = client.db(dbName);
        // Get the documents collection
        let collection = db.collection(collectionName);
        // Find some documents

        try {
            let sent = await collection.find({fromUser: userID}).toArray().catch(reject);
            let inbox = await collection.find({toUser: userID }).toArray().catch(reject);
            
            if (!sent || !inbox) {
                reject("Unexpected error");
            }

            let contacts = [];

            for (let i = 0; i < sent.length; i++) {
                if (contacts.indexOf(sent[i].toUser) == -1) {
                    contacts.push(sent[i].toUser);
                }
            }

            for (let i = 0; i < inbox.length; i++) {
                if (contacts.indexOf(inbox[i].fromUser) == -1) {
                    contacts.push(inbox[i].fromUser);
                }
            }

            for (let i = 0; i < contacts.length; i++) {
                let id = contacts[i];
                try {
                    let user = await User.getUserFromID(id);
                    if (user) {
                        // TODO: make this into title + firstname + surname
                        contacts[i] = {id: id, username: user.username};
                    } else {
                        reject("Could not find user");
                    }
                } catch (e) {
                    reject(e);
                }
            }
            resolve(contacts);
        } catch (e) {
            reject(e);
        }
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

module.exports = {sendMessage, getMessagesFromUser, getRecentContacts, getNumberOfMessages};
