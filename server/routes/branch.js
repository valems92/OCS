'use strict';

var express = require('express'),
    router = express.Router(),
    auth = require('./auth'),
    branch = require('../lib/branch');

/*********** PUBLIC *************/

router.get('/getBranches', branch.getBranches);

/*********** AUTH *************/

router.post('/addBranch', auth.authAdmin, branch.addBranch);

router.delete('/deleteBranch/:id', auth.authAdmin, branch.deleteBranch);

module.exports = router;