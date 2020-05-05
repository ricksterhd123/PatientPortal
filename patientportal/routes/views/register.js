const express = require('express');
const router = express.Router();


router.get("/", function (req, res) {
    let token = req.token;
    if (token) {
      res.redirect('/');
    } else {
      res.render('register.pug', { title: 'register' });
    }
});

module.exports = router;