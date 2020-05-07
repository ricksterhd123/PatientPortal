const express = require('express');
const router = express.Router();
const Roles = require('../../../libs/roles');
const Appointment = require('../../../libs/models/appointments');
const User = require('../../../libs/models/user');

// assume patient is making appointment first

/**
 * Get all available slots
 */
router.get("/", async function (req, res) {
    if (req.token) {
        try {
            if (req.token.role == Roles.USER) {
                let appointments = await Appointment.getSlotsTaken();
                let users = await User.getAllUsers();
                users = users.filter((x) => {return x.options.role == Roles.DOCTOR});
                if (!users) {
                    res.status(500).send();
                    console.trace("No clinicians found");
                } else {
                    res.json({result: appointments, clinicians: users.length});
                }
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