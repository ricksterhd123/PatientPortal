const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const Roles = require('../../../libs/roles');
const User = require('../../../libs/models/user');

// assume patient is making appointment first

/**
 * Get all available slots
 */
router.get("/", async function (req, res) {
    if (req.token && req.token.role == Roles.ADMIN) {
        try {
            let id = new ObjectID(req.token.id);
            let users = await User.getAllUsers();
            // don't let the user edit themselves
            users = users.filter(u=>{return !id.equals(new ObjectID(u._id))}).map(u => {return {_id:u._id, username: u.username, options: u.options}}); // don't give password hash
            res.json({result: users});
        } catch (e) {
            res.status(500).send();
            console.error(e);
        }
    } else {
        res.status(401).send();
    }
});

router.post("/", async function (req, res) {
    if (req.token && req.token.role == Roles.ADMIN && req.body.role && req.body._id) {
        try {
            let id = new ObjectID(req.body._id);
            let role = req.body.role;
            if (role == Roles.USER || role == Roles.DOCTOR || role == Roles.ADMIN) {
                let result = await User.changeRole(id, role);
                res.json({result: result ? true : false});
            } else {
                throw "Invalid role";
            }
        } catch (e) {
            res.status(500).send();
            console.error(e);
        }
    } else {
        res.status(401).send();
    }
})
module.exports = router;