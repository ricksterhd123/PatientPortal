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
    let token = req.token;
    let result = null;
    if (!token) {
        let username = req.body.username;
        let password = req.body.password;
        let valid = validator.username(username) && validator.password(password);

        if (valid) {
            let salt = await bcrypt.genSalt(saltRounds).catch((err) => {
                console.trace(err);
                res.json({
                    result: result,
                    error: "Come back again later..."
                });
            });

            if (salt) {
                let hash = await bcrypt.hash(password, salt).catch((err) => {
                    console.trace(err);
                    res.json({
                        result: result,
                        error: "Come back again later..."
                    });
                });

                if (hash) {
                    let count = await userModel.getNumberOfUsers().catch(console.trace);

                    let role = roles.USER;
                    if (count == 0) {
                        role = roles.ADMIN;
                    }

                    let result = null;
                    let user = new userModel.User(null, username, hash, { role: role });
                    user = await userModel.createUser(user).catch(console.trace);

                    if (user) {
                        let token = jwt.sign({
                            username: user.username
                        }, JWTSecret);

                        if (token) {
                            result = {username:user.username, role:user.options.role};
                            res.cookie('jwt', token, {
                                httpOnly: true
                            });
                        } else {
                            console.trace("Could not create token");
                        }
                    }

                    res.json({
                        result: result,
                        error: result ? null : "Failed to register, please try a different username"
                    });
                }
            }

        } else {
            res.json({
                result: result,
                error: "Username must be alphanumeric characters only and password must be at least 5 characters in length"
            });
        }
    } else {
        res.json({
            result: result,
            error: "Already logged in"
        });
    }
});

module.exports = router;