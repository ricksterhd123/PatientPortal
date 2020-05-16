const mongo = require("./mongo");
const ObjectId = require("mongodb").ObjectId;
const dbName = "PatientPortal";
const collectionName = "Appointments";
const duration = "15";

function create(clinicianID, patientID, dateTime) {
  dateTime = new Date(dateTime);
  clinicianID = new ObjectId(clinicianID);
  patientID = new ObjectId(patientID);
    return new Promise(async function (resolve, reject) {
      try {
        let client = await mongo.client.connect(mongo.URL, mongo.options);
        let db = client.db(dbName);

        // Get the documents collection
        let = collection = db.collection(collectionName);

        // Check if the appointment is already booked.
        let valid = true;
        let appointments = await collection
          .find({ clinicianID: clinicianID })
          .toArray();
        appointments.sort((a, b) => {
          return new Date(a.dateTime) < new Date(b.dateTime);
        });
        for (let i = 0; i < appointments.length; i++) {
          let offset = Math.floor(
            (new Date(appointments[i].dateTime) - dateTime) / 1000 / 60
          );
          if (offset == 0 || offset % 15 != 0) {
            valid = false;
          }
        }

        if (valid) {
          let result = await collection.insertOne({
            clinicianID: clinicianID,
            patientID: patientID,
            dateTime: dateTime,
            duration: duration,
          });
          if (result.insertedCount == 1) {
            resolve(true);
          } else {
            reject("Inserted more than one documents");
          }
        } else {
          resolve(false);
        }
      } catch (e) {
        reject(e);
      }
    });
}

function update(appointmentID, newDateTime) {
  appointmentID = new ObjectId(appointmentID);
  newDateTime = new Date(newDateTime);
    return new Promise(async function (resolve, reject) {
      try {
        let client = await mongo.client.connect(mongo.URL, mongo.options);
        let db = client.db(dbName);
        let collection = db.collection(collectionName);

        // Check if the newDateTime overlaps with clinicians schedule
        let valid = true;
        let appointment = await collection
          .find({ _id: appointmentID })
          .toArray();
        if (!appointment) {
          reject("Invalid appointment id");
        } else {
          let appointments = await collection
            .find({ clinicianID: appointment[0].clinicianID })
            .toArray();
          appointments.sort((a, b) => {
            return new Date(a.dateTime) < new Date(b.dateTime);
          });
          for (let i = 0; i < appointments.length; i++) {
            let offset = Math.floor(
              (new Date(appointments[i].dateTime) - newDateTime) / 1000 / 60
            );
            if (offset == 0 || offset % 15 != 0) {
              valid = false;
            }
          }

          if (valid) {
            let success = await collection.updateOne(
              { _id: appointmentID },
              { $set: { dateTime: newDateTime } }
            );
            resolve((success && true) || false);
          } else {
            resolve(false);
          }
        }
      } catch (e) {
        reject(e);
      }
    });
}

function cancel(appointmentID) {
  appointmentID = new ObjectId(appointmentID);
  return new Promise(async function (resolve, reject) {
    try {
      let client = await mongo.client.connect(mongo.URL, mongo.options);
      let db = client.db(dbName);
      let collection = db.collection(collectionName);

      let success = await collection.deleteOne({ _id: appointmentID });
      resolve((success && true) || false);
    } catch (e) {
      reject(e);
    }
  });
}

function getSlotsTaken() {
  return new Promise(async function (resolve, reject) {
    try {
      let client = await mongo.client.connect(mongo.URL, mongo.options);
      let db = client.db(dbName);
      // Get the documents collection
      let collection = db.collection(collectionName);
      let allAppointments = await collection.find({}).toArray();
      allAppointments.sort((a, b) => {
        return new Date(a.dateTime) < new Date(b.dateTime);
      });

      // let clinicians = [];

      // for (let i = 0; i < allAppointments.length; i++) {
      //     let index = clinicians.findIndex(v => {return v.clinicianID.equals(allAppointments[i].clinicianID)});
      //     if (index == -1) {
      //         index = clinicians.push({clinicianID: allAppointments[i].clinicianID, appointments: []}) - 1;
      //     }
      //     clinicians[index].appointments.push({dateTime: allAppointments[i].dateTime, duration: allAppointments[i].duration});
      // }

      resolve(allAppointments);
    } catch (e) {
      reject(e);
    }
  });
}

function getPatientSchedule(userID) {
  userID = new ObjectId(userID);
  return new Promise(async function (resolve, reject) {
    try {
      let client = await mongo.client.connect(mongo.URL, mongo.options);
      let db = client.db(dbName);
      // Get the documents collection
      let collection = db.collection(collectionName);
      let allAppointments = await collection
        .find({ patientID: userID })
        .toArray();
      allAppointments.sort((a, b) => {
        return new Date(a.dateTime) < new Date(b.dateTime);
      });
      resolve(allAppointments);
    } catch (e) {
      reject(e);
    }
  });
}

function getClinicianSchedule(userID) {
  userID = new ObjectId(userID);
  return new Promise(async function (resolve, reject) {
    try {
      let client = await mongo.client.connect(mongo.URL, mongo.options);
      let db = client.db(dbName);
      // Get the documents collection
      let collection = db.collection(collectionName);
      let allAppointments = await collection
        .find({ clinicianID: userID })
        .toArray();
      allAppointments.sort((a, b) => {
        return new Date(a.dateTime) < new Date(b.dateTime);
      });
      resolve(allAppointments);
    } catch (e) {
      reject(e);
    }
  });
}
module.exports = {
  create,
  update,
  cancel,
  getSlotsTaken,
  getPatientSchedule,
  getClinicianSchedule,
};
