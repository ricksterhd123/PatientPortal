const express = require('express');
const router = express.Router();
const Roles = require('../../../libs/roles');
const Appointment = require('../../../libs/models/appointments');
const User = require('../../../libs/models/user');

/**
 * Get user schedule
 */
router.get("/", async function (req, res) {
    if (req.token) {
        try {
            let role = req.token.role;
            let id = req.token.id;
            let schedule = [];
            if (!req.body.id) {
                if (role == Roles.USER) {
                    schedule = await Appointment.getPatientSchedule(id);
                } else if (role == Roles.DOCTOR) {
                    schedule = await Appointment.getClinicianSchedule(id);
                } 
            } else {
                let user = await User.getUserFromID(req.body.id);
                if (user) {
                    switch (user.role) {
                        case Roles.DOCTOR:
                            schedule = await Appointment.getClinicianSchedule(req.body.id);
                            schedule = schedule.map(a => {return {_id: a._id, clinicianID: a.clinicianID, dateTime: a.dateTime, duration: a.duration}});
                        default:
                            throw "Not implemented";
                    }
                }
            }
            res.json({result: schedule});
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }        
    } else {
        res.status(401).send();
    }
});

module.exports = router;