'use strict';

var errorHandler = require('../utils/errorHandler');
var COLLECTION_NAME = 'messages';

function _addMessage(req, res, id, data, doc) {
    var _doc = doc._doc;
    var messages = _doc.messages;
    messages.push(data);

    var updateData = {
        messages: messages
    };

    req.DB.findByIdAndUpdate(COLLECTION_NAME, id, updateData, function (err, data) {
        if (err) {
            errorHandler.onError({message: "There was an error while saving message in DB"}, res);
        } else {
            res.json(data._doc);
        }
    });
}

function createMessage(req, id, cb) {
    var message = {
        _id: id,
        messages: []
    };

    req.DB.create(COLLECTION_NAME, message, cb);
}

module.exports = {
    getMessage: function (req, res) {
        var id = req.params.id;

        req.DB.findById(COLLECTION_NAME, id, function (err, doc) {
            if (err || !doc) {
                if (!doc || err.name === "DocumentNotFoundError") {
                    createMessage(req, id, function (err, message) {
                        if (err) {
                            errorHandler.onError({message: "There was an error getting the previous messages"}, res);
                        } else {
                            res.json(message._doc);
                        }
                    })
                } else {
                    errorHandler.onError({message: "There was an error getting the previous messages"}, res);
                }
            } else {
                res.json(doc._doc);
            }
        });
    },

    addMessage: function (req, res) {
        var message = req.body;
        var id = message.id;

        delete message.id;

        console.log("new message to " + id);

        req.DB.findById(COLLECTION_NAME, id, function (err, doc) {
            if (err) {
                if (err.name === "DocumentNotFoundError") {
                    createMessage(req, id, function (err, msn) {
                        if (err) {
                            errorHandler.onError({message: "There was an error adding the message"}, res);
                        } else {
                            _addMessage(req, res, id, message, msn);
                        }
                    })
                } else {
                    errorHandler.onError({message: "There was an error adding the message"}, res);
                }
            } else {
                if (doc) {
                    _addMessage(req, res, id, message, doc);
                } else {
                    errorHandler.onError({message: "There was an error adding the message"}, res);
                }
            }
        });
    }

};