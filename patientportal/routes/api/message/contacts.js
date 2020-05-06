/**
 * Get all available contacts with most recent first.
 */
const express = require('express');
const messages = require('../../../libs/models/messages');
const router = express.Router();

router.get('/', async function(req, res) {
    if (req.token) {
        try {
            let userid = req.token.id;
            let contacts = await messages.getContacts(userid).catch(console.error);
            if (contacts) {
                console.log(contacts);
                res.json({result: contacts});
            }
        } catch (e) {
            res.status(500).send();
        }
    } else {
        res.status(401).send();
    }
});

module.exports = router;