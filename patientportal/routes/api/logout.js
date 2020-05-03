const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.clearCookie('jwt');
    res.redirect("/");
});

module.exports = router;