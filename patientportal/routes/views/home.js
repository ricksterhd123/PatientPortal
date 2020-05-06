const express = require('express');
const router = express.Router();
router.get("/", async function (req, res) {
    let token = req.token;
    if (!token) {
      res.status(401).send();
    } else {
      console.log(token.role);
      res.render('home.pug', { title: "Home", name: token.id, role: token.role });
    }
});

module.exports = router;