'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BranchSchema = new Schema({
    lat: {
        type: Number,
        required: [true, 'Lat is required']
    },
    lng: {
        type: Number,
        required: [true, 'Lng is required']
    },
    title: {
        type: String,
        default: 'OCS Branch'
    }
}, { id: true });

module.exports = mongoose.model('branches', BranchSchema);