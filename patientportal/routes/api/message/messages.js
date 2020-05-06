const express = require('express');
const Message = require('../../../libs/models/messages');
const router = express.Router();

router.get("/:userID", async function (req, res) {
    if (req.token && req.params.userID) {
        try {
            let id = req.token.id;
            let messages = await Message.getMessagesFromUser(id, req.params.userID);
            console.log(messages);
            res.json({result: messages}); 
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    } else {
        res.status(401).send();
    }
});

module.exports = router;