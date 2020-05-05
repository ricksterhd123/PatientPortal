import { Router } from 'express';
const messages = require('../../../libs/models/messages');
const router = Router();

router.get('/', function(req, res) {
    if (req.token) {
        let username = req.token.username;

        messages.getRecentContacts()
        res.json(contacts);
    } else {
        res.status(401).send();
    }
});

export default router;