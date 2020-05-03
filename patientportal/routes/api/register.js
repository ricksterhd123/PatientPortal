const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../../libs/models/user');
const roles = require('../../libs/roles');
const validator = require('../../libs/validators');
const JWTSecret = require('../../libs/secrets').JWTSecret;
const saltRounds = 10;
const router = express.Router();

/**
 * POST /api/register
 * Content-type: json/application 
 * example: 
 * req.body = {
 *    username: "username",
 *    password: "password"
 * }
 */
router.post('/', async function (req, res) {
    var token = req.token;
    if (!token) {
        let username = req.body.username;
        let password = req.body.password;
        let valid = validator.username(username) && validator.password(password);

        if (valid) {
            let salt = await bcrypt.genSalt(saltRounds).catch((err) => {
                console.trace(err);
                res.json({
                    success: false,
                    error: "Come back again later..."
                });
            });

            if (salt) {
                let hash = await bcrypt.hash(password, salt).catch((err) => {
                    console.trace(err);
                    res.json({
                        success: false,
                        error: "Come back again later..."
                    });
                });

                if (hash) {
                    let count = await userModel.getNumberOfUsers().catch(console.trace);

                    let role = roles.USER;
                    if (count == 0) {
                        role = roles.ADMIN;
                    }

                    let user = new userModel.User(null, username, hash, { role: role });
                    var success = await userModel.createUser(user).catch(console.trace);

                    if (success) {
                        let token = jwt.sign({
                            username: user.username
                        }, JWTSecret);

                        if (token) {
                            res.cookie('jwt', token, {
                                httpOnly: true
                            });

                        } else {
                            console.trace("Could not create token");
                            success = false;
                        }
                    }

                    res.json({
                        success: success,
                        error: success ? null : "Failed to register, please try a different username"
                    });
                }
            }

        } else {
            res.json({
                success: false,
                error: "Username must be alphanumeric characters only and password must be at least 5 characters in length"
            });
        }
    } else {
        res.json({
            success: false,
            error: "Already logged in"
        });
    }
});

module.exports = router;