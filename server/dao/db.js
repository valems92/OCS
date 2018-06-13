'use strict';
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    userModel = require('../schemas/userSchema'),
    cartModel = require('../schemas/cartSchema'),
    clothModel = require('../schemas/clothSchema'),
    branchModel = require('../schemas/branchSchema'),
    messageModel = require('../schemas/messageSchema');

function Db() {
    this.collections = {
        'users': userModel,
        'carts': cartModel,
        'clothes': clothModel,
        'branches': branchModel,
        'messages': messageModel
    }
}

Db.prototype.create = function (collectionName, item, cb) {
    if (collectionName && this.collections[collectionName]) {
        this.collections[collectionName].create(item, cb);
    } else {
        cb(new Error('Invalid collection'));
    }
};

Db.prototype.find = function (collectionName, item, cb) {
    if (collectionName && this.collections[collectionName]) {
        this.collections[collectionName].find(item, cb);
    } else {
        cb(new Error('Invalid collection'));
    }
};

Db.prototype.findById = function (collectionName, id, cb) {
    if (collectionName && this.collections[collectionName]) {
        id = ObjectId(id);
        this.collections[collectionName].findById(id, cb);
    } else {
        cb(new Error('Invalid collection'));
    }
};

Db.prototype.findByIdAndUpdate = function (collectionName, id, update, cb) {
    if (collectionName && this.collections[collectionName]) {
        id = ObjectId(id);
        this.collections[collectionName].findByIdAndUpdate(id, update, cb);
    } else {
        cb(new Error('Invalid collection'));
    }
};

Db.prototype.findByIdAndRemove = function (collectionName, id, cb) {
    if (collectionName && this.collections[collectionName]) {
        id = ObjectId(id);
        this.collections[collectionName].findByIdAndRemove(id, cb);
    } else {
        cb(new Error('Invalid collection'));
    }
};

Db.prototype.aggregate = function (collectionName, aggregation, cb) {
    if (collectionName && this.collections[collectionName]) {
        this.collections[collectionName].aggregate(aggregation).then(function (res) {
            cb(res);
        });
    } else {
        cb(new Error('Invalid collection'));
    }
};

module.exports = {
    connect: function (dbUrl) {
        return new Promise(function (resolve, reject) {
            mongoose.connect(dbUrl);

            var db = mongoose.connection;
            db.on('error', function (err) {
                reject(err);
            });
            db.once('open', function () {
                resolve(new Db());
            });
        });
    }
};