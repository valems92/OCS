'use strict';

var express = require('express'),
    router = express.Router(),
    auth = require('./auth'),
    catalog = require('../lib/catalog');

/*********** PUBLIC *************/

router.get("/getCloth/:id", catalog.getCloth);

router.get("/getClothes", catalog.getClothes);

/*********** AUTH *************/

router.post("/storeCloth", auth.authAdmin, catalog.storeCloth);

router.post("/updateCloth", auth.authAdmin, catalog.updateCloth);

router.delete("/deleteCloth/:id", auth.authAdmin, catalog.deleteCloth);

module.exports = router;