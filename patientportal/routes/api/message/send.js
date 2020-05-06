const express = require('express');
const Message = require('../../../libs/models/messages');
const router = express.Router();

router.post("/:userID", async function (req, res) {
    console.log(req.params.userID);
    console.log(req.token);
    console.log(req.body);
    if (req.token && req.body.timeStamp && req.body.message) {
        try {
            let id = req.token.id;
            let role = req.token.role;
            let success = await Message.sendMessage(id, req.params.userID, req.body.timeStamp, req.body.message);
            console.log(success);
            res.json({result: success});
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    }
});

module.exports = router;