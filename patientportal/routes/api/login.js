const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../../libs/models/user');

const JWTSecret = require('../../libs/secrets').JWTSecret;

const router = express.Router();

/**
  POST /api/login
  Basic authentication => JSON web token
*/

router.post('/', async function (req, res) {
    let auth = req.header('authorization').replace("Basic", "");
    let decoded = Buffer.from(auth, 'base64').toString();
    let [username, password] = decoded.split(":");
    let result = null;
    let user = new userModel.User(null, username);
    user = await userModel.getUser(user).catch(console.trace);

    if (user) {
        let hash = user.password;
        let valid = await bcrypt.compare(password, hash);

        if (valid) {
            res.cookie('jwt', jwt.sign({
                username: username
            }, JWTSecret), {
                httpOnly: true
            });
            result = {username: user.username, role: user.options.role};
        }

        res.json({
            result: result,
            error: result ? null : "Invalid username or password..."
        });
    } else {
        res.json({
            result: result,
            error: "Invalid username or password..."
        });
    }
});

module.exports = router;