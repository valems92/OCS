'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var _cartSchema = new Schema({
    clothId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        default: 'waiting',
        enum: ['purchased', 'waiting']
    },
    added: {
        type: Date,
        default: Date.now
    },
    purchased: {
        type: Date,
        default: null
    }
});

var CartSchema = new Schema({
    _id: Schema.Types.ObjectId,
    cart: [_cartSchema]
}, {_id: false});

module.exports = mongoose.model('carts', CartSchema);