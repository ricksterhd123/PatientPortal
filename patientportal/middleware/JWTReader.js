const express = require('express');
const jwt = require('jsonwebtoken');
const JWTSecret = require('../libs/secrets').JWTSecret;
const router = express.Router();

router.use((req, _res, next) => {
    let token = req.cookies.jwt;
    if (token) {
        let valid = jwt.verify(token, JWTSecret);
        if (valid) {
            req.token = valid;
        }
    }
    next();
});

module.exports = router;