const express = require('express');
const router = express.Router();
const Roles = require('../../../libs/roles');
const Appointment = require('../../../libs/models/appointments');

// assume patient is making appointment first
router.post("/", async function (req, res) {
    if (req.token && req.body.id && req.body.dateTime) {  
        let patientID = req.token.id;
        let role = req.token.role;
        if (role == Roles.USER) {
            try {
                let success = await Appointment.create(req.body.id, patientID, req.body.dateTime);
                res.json({result: success});
            } catch (e) {
                console.error(e);
                res.status(500).send();
            }    
        } else {
            res.status(500).send("Not implemented");
        }
    } else {
        console.error("No token or request body");
        res.status(401).send();
    }
});

module.exports = router;