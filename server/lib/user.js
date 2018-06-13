'use strict';

var errorHandler = require('../utils/errorHandler'),
    jwt = require('jsonwebtoken'),
    cart = require('./cart');

var COLLECTION_NAME = 'users';

module.exports = {
    register: function (req, res) {
        var newUser = req.body;

        req.DB.create(COLLECTION_NAME, newUser, function (err, doc) {
            if (err) {
                errorHandler.onError({message: "There was an error while registration"}, res);
            } else {
                cart.createCart(req, doc.id, function () {
                    res.json(doc);
                });
            }
        });
    },

    login: function (req, res) {
        if (!req.body.email || !req.body.password) {
            errorHandler.onError({message: "You must provide all data fields"}, res);
            return;
        }

        req.DB.find(COLLECTION_NAME, {email: req.body.email}, function (err, docs) {
            if (err) {
                errorHandler.onError({message: "There was an error while trying to login"}, res);
            } else {
                if (docs.length === 1) {
                    var doc = docs[0];
                    doc.comparePassword(req.body.password, function (err) {
                        if (err) {
                            errorHandler.onError({
                                code: 401,
                                message: "Authentication failed. Password incorrect"
                            }, res);
                            return;
                        }

                        res.json({
                            user: doc,
                            token: jwt.sign({
                                email: doc.email,
                                fullName: doc.fullName,
                                _id: doc._id,
                                role: doc.role
                            }, 'secret', {expiresIn: "24h"})
                        });
                    });
                } else {
                    errorHandler.onError({
                        code: 401,
                        message: "Authentication failed"
                    }, res);
                }
            }
        });
    },

    profile: function (req, res) {
        var token = req.decoded;

        req.DB.findById(COLLECTION_NAME, token._id, function (err, doc) {
            if (err) {
                errorHandler.onError({message: "There was an error getting the profile"}, res);
            } else {
                res.json({user: doc});
            }
        });
    },

    updatePassword: function (req, res) {
        var token = req.decoded;
        var data = {
            password: req.body.newPassword
        };

        req.DB.findByIdAndUpdate(COLLECTION_NAME, token._id, data, function (err, data) {
            if (err) {
                errorHandler.onError({message: "There was an error updating the profile"}, res);
            } else {
                res.json(data._doc);
            }
        });
    },

    updateProfile: function (req, res) {
        var token = req.decoded;
        var data = req.body;

        req.DB.findByIdAndUpdate(COLLECTION_NAME, token._id, data, function (err, data) {
            if (err) {
                errorHandler.onError({message: "There was an error updating the profile"}, res);
            } else {
                res.json(data._doc);
            }
        });
    }
};