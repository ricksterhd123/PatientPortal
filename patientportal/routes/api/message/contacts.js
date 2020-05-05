const express = require('express');
const messages = require('../../../libs/models/messages');
const router = express.Router();

router.get('/', async function(req, res) {
    if (req.token) {
        let userid = req.token.id;
        let contacts = await messages.getRecentContacts(userid).catch(console.error);
        if (contacts) {
            console.log(contacts);
            res.json({result: contacts});
        }
    } else {
        res.status(401).send();
    }
});

module.exports = router;