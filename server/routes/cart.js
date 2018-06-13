'use strict';

var express = require('express'),
    router = express.Router(),
    auth = require('./auth'),
    cart = require('../lib/cart');

/*********** AUTH *************/
router.get('/getCart', auth.authUser, cart.getCart);

router.post('/addToCart', auth.authUser, cart.addToCart);

router.post('/buyCart', auth.authUser, cart.buyCart);

router.delete('/removeFromCart/:id', auth.authUser, cart.removeFromCart);

router.get('/getPurchases', auth.authUser, cart.getPurchases);

router.get('/getAllPurchases', auth.authAdmin, cart.getAllPurchases);

module.exports = router;