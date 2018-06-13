'use strict';

var express = require('express'),
    router = express.Router(),
    message = require('../lib/message');

/*********** PUBLIC *************/
router.get("/getMessages/:id", message.getMessage);

router.post("/addMessage", message.addMessage);


module.exports = router;