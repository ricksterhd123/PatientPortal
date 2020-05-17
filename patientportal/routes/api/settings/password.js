const express = require('express');
const User = require('../../../libs/models/user');
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 10;
router.post("/", async function (req, res) {
  console.log(req.token);
  console.log(req.body);
  if (req.token && req.body.password && req.body.newPassword) {
    try {
      let user = await User.getUserFromID(req.token.id);
      let hash = user.password;
      console.log(hash);
      let valid = await bcrypt.compare(req.body.password, hash);
      console.log(valid);
      if (valid) {
        let salt = await bcrypt.genSalt(saltRounds);
        let newHash = await bcrypt.hash(req.body.newPassword, salt);
        let success = await User.changePassword(req.token.id, newHash);
        res.json({result: success ? true : false});
      } else {
        res.json({result: false});
      }
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  } else {
    res.status(401).send();
  }
});

module.exports = router;