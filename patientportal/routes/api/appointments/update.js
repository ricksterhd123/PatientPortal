const express = require('express');
const router = express.Router();
const Roles = require('../../../libs/roles');
const Appointment = require('../../../libs/models/appointments');

// assume patient is making appointment first

/**
 * Get all available slots
 */
router.post("/", async function (req, res) {
    if (req.token && req.body.appointmentID && req.body.newDateTime) {
        try {
            let appointments = await Appointment.update(req.body.appointmentID, req.body.newDateTime);
            res.json({result: appointments});
        } catch (e) {
            res.status(500).send();
            console.error(e);
        }
    } else {
        res.status(401).send();
    }
});

module.exports = router;