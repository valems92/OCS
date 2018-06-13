'use strict';

var errorHandler = require('../utils/errorHandler');
var COLLECTION_NAME = 'clothes';

module.exports = {
    getCloth: function (req, res) {
        var clothId = req.params.id;

        req.DB.findById(COLLECTION_NAME, clothId, function (err, doc) {
            if (err) {
                errorHandler.onError({message: "There was an error getting the wanted cloth"}, res);
            } else {
                res.json(doc);
            }
        });
    },

    getClothes: function (req, res) {
        req.DB.find(COLLECTION_NAME, {}, function (err, clothes) {
            if (err) {
                errorHandler.onError({message: "There was an error getting all clothes"}, res);
            } else {
                res.json(clothes || []);
            }
        })
    },

    storeCloth: function (req, res) {
        var cloth = req.body;

        req.DB.create(COLLECTION_NAME, cloth, function (err, data) {
            if (err) {
                errorHandler.onError({message: "There was an error while saving the cloth"}, res);
            } else {
                res.json({id: data.id});
            }
        });
    },

    updateCloth: function (req, res) {
        var data = req.body;

        var newData = {
            provider: data.cloth.provider,
            description: data.cloth.description,
            price: data.cloth.price,
            color: data.cloth.color,
            imagePath: data.cloth.imagePath
        };

        req.DB.findByIdAndUpdate(COLLECTION_NAME, data.id, newData, function (err, doc) {
            if (err) {
                errorHandler.onError({message: "There was an error updating the cloth"}, res);
            } else {
                res.json(data._doc);
            }
        });
    },

    deleteCloth: function (req, res) {
        var clothId = req.params.id;

        req.DB.findByIdAndRemove(COLLECTION_NAME, clothId, function (err) {
            if (err) {
                errorHandler.onError({message: "There was an error deleting the wanted cloth"}, res);
            } else {
                res.json({message: 'Deleted'});
            }
        });
    }
};