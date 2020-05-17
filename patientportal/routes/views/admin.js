const express = require('express');
const Roles = require('../../libs/roles');
const router = express.Router();

router.get("/", function (req, res) {
    if (req.token.role == Roles.ADMIN) {
        res.render('admin.pug');
    } else {
        res.status(401).send();
    }
});

module.exports = router;