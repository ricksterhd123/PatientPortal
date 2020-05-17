const express = require('express');
const User = require('../../../libs/models/user');
const router = express.Router();

router.get("/", async function (req, res) {
  if (req.token) {
    try {
      let user = await User.getUserFromID(req.token.id);
      user = {_id: user._id, username: user.username, options: user.options}; // don't give away password hash
      res.json({result: user});
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  } else {
    res.status(401).send();
  }
});

module.exports = router;