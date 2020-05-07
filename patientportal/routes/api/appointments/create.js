const express = require('express');
const router = express.Router();
const Roles = require('../../../libs/roles');
const Appointment = require('../../../libs/models/appointments');

// assume patient is making appointment first
router.get("/", async function (req, res) {
    if (!req.body.clinicianID || !req.body.dateTime) {
        console.error("Could not find required arguments in request body");
        res.status(401).send();
    } else if (req.token) {  
        let patientID = req.token.id;
        let role = req.token.role;
        if (role == Roles.USER) {
            try {
                let success = await Appointment.create(req.body.clinicianID, patientID, req.body.dateTime);
                res.json({result: success});
            } catch (e) {
                console.error(e);
                res.status(500).send();
            }    
        } else {
            res.status(500).send("Not implemented");
        }
    } else {
        console.error("No token provided");
        res.status(401).send();
    }
});

module.exports = router;