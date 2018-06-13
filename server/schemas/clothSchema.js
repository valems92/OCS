'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClothSchema = new Schema({
    provider: {
        required: [true, 'Provider is required'],
        type: String
    },
    description: String,
    price: {
        required: [true, 'Price is required'],
        type: Number,
        min: 0
    },
    color: String,
    imagePath: {
        type: String,
        required: [true, 'Image is required']
    }
}, { id: true });

module.exports = mongoose.model('clothes', ClothSchema);