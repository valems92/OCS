'use strict';

var express = require('express'),
    router = express.Router(),
    auth = require('./auth'),
    user = require('../lib/user');

/*********** PUBLIC *************/
router.post("/register", user.register);

router.post("/login", user.login);

/*********** AUTH *************/

router.get('/profile', auth.authUser, user.profile);

router.post('/updatePassword', auth.authUser, user.updatePassword);

router.post('/updateProfile', auth.authUser, user.updateProfile);

module.exports = router;

