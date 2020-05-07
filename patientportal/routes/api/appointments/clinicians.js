const express = require('express');
const router = express.Router();
const Roles = require('../../../libs/roles');
const User = require('../../../libs/models/user');
const Appointment = require('../../../libs/models/appointments');

// assume patient is making appointment first
router.get("/", async function (req, res) {
    if (req.token) {  
            try {
                //let success = await Appointment.create(req.body.clinicianID, patientID, req.body.dateTime);
                let users = await User.getAllUsers();
                users = users.filter(user => {return user.options.role == Roles.DOCTOR});
                res.json({result: users.map(user => {
                    return {_id: user._id, username: user.username};
                })});
            } catch (e) {
                console.error(e);
                res.status(500).send();
            }    
    } else {
        console.error("No token provided");
        res.status(401).send();
    }
});

module.exports = router;