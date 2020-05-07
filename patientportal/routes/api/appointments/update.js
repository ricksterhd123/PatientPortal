const express = require('express');
const router = express.Router();
const Roles = require('../../../libs/roles');
const Appointment = require('../../../libs/models/appointments');

// assume patient is making appointment first

/**
 * Get all available slots
 */
router.get("/", async function (req, res) {
    if (req.token && req.body.appointmentID && req.body.newDateTime) {
        try {
            if (req.token.role == Roles.USER) {
                let appointments = await Appointment.update(req.body.appointmentID, req.body.newDateTime);
                res.json({result: appointments});
            } else {
                res.status(500).send("Not implemented");
            }
        } catch (e) {
            res.status(500).send();
            console.error(e);
        }
    } else {
        res.status(401).send();
    }
});

module.exports = router;