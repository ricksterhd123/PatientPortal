const mongo = require('./mongo');
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const User = require('./user');
const Roles = require('../roles');
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

/**
 * Get a list of all messages between two users
 * @param {string || ObjectId} fromUser 
 * @param {string || ObjectId} toUser 
 */
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

            messages.sort( (a, b) => {
                let aDate = new Date(a.timeStamp);
                let bDate = new Date(b.timeStamp);
                return aDate < bDate;
            });

            resolve(messages);
        } catch (e) { 
            reject(e);
        };
    });
}

/**
 * Filter contacts for certain roles
 * Users can only message doctors
 * Doctors and admins can message any user
 */
function filterContacts(role, contacts) {
    if (role == Roles.USER) {
        // Doctors only
        return contacts.filter(v => {return v.options.role == Roles.USER || v.options.role == Roles.DOCTOR || v.options.role == Roles.ADMIN});
    } else if (role == Roles.DOCTOR) {
        // All
        return Contacts.filter(v => {return v.options.role == Roles.USER || v.options.role == Roles.DOCTOR || v.options.role == Roles.ADMIN});
    } else if (role == Roles.ADMIN) {
        // Doctors and admins only, but for debugging: all
        return Contacts.filter(v => {return v.options.role == Roles.USER || v.options.role == Roles.DOCTOR || v.options.role == Roles.ADMIN});
    }
}

/**
 * Returns promise to find list of userID contacats
 * note: resolve given false is no user is found
 * @param {string} userID - A string userID
 * @returns Promise 
 */
function getContacts(userID) {
    userID = new ObjectId(userID);
    return new Promise(async function (resolve, reject) {
        let client = await mongo.client.connect(mongo.URL, mongo.options).catch(reject);
        let db = client.db(dbName);
        // Get the documents collection
        let collection = db.collection(collectionName);
        // Find some documents

        try {
            // Get all users
            let allUsers = await User.getAllUsers();
            // Get the user with id: userID
            let thisUserIndex = allUsers.findIndex(v => {
                return new ObjectId(v._id).equals(userID);
            });
            allUsers.splice(thisUserIndex, 1);

            // Find recent contacts
            let sent = await collection.find({fromUser: userID}).toArray();
            let inbox = await collection.find({toUser: userID }).toArray();

            let contacts = [];

            // Push all contacts userID sent messages to.
            for (let i = 0; i < sent.length; i++) {
                let id = sent[i].toUser;
                if (contacts.findIndex((c) => {return new ObjectId(c).equals(new ObjectId(id))}) == -1) {
                    contacts.push(sent[i].toUser);
                }
            }

            // Push all contacts userID received messages from.
            for (let i = 0; i < inbox.length; i++) {
                let id = inbox[i].fromUser;
                if (contacts.findIndex((c) => {return new ObjectId(c).equals(new ObjectId(id))}) == -1) {
                    contacts.push(inbox[i].fromUser);
                }
            }

            // Get their id and usernames
            for (let i = 0; i < contacts.length; i++) {
                let id = contacts[i];
                let index = allUsers.findIndex(v => {
                    return new ObjectId(v._id).equals(new ObjectId(id));
                });

                if (index != -1) {
                    contacts[i] = {id: id, username: allUsers[index].username};
                }
            }

            // Add the rest
            for (let i = 0; i < allUsers.length; i++) {
                let index = contacts.findIndex(v => { return new ObjectId(v.id).equals(new ObjectId(allUsers[i]._id)) });
                if (index == -1) {
                    contacts.push({id: allUsers[i]._id, username: allUsers[i].username});
                }
            }
            //contacts = filterContacts(thisUserRole, contacts);
            resolve(contacts);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Count number of all messages in the system
 */
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

module.exports = {sendMessage, getMessagesFromUser, getContacts, getNumberOfMessages};
