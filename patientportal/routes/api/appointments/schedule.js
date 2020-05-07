const express = require('express');
const router = express.Router();
const Roles = require('../../../libs/roles');
const Appointment = require('../../../libs/models/appointments');

/**
 * Get user schedule
 */
router.get("/", async function (req, res) {
    if (req.token) {
        let role = req.token.role;
        let id = req.token.id;
        let schedule = [];
        
        if (role == Roles.USER) {
            schedule = await Appointment.getPatientSchedule(id);
        } else if (role == Roles.DOCTOR) {
            schedule = await Appointment.getClinicianSchedule(id);
        }

        res.json({result: schedule})
    } else {
        res.status(401).send();
    }
});

module.exports = router;