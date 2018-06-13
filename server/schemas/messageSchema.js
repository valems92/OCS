'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var _messageSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	added: {
		type: Date,
		default: Date.now
	}
});

var MessageSchema = new Schema({
	_id: Schema.Types.ObjectId,
	messages: [_messageSchema]
}, {_id: false});

module.exports = mongoose.model('messages', MessageSchema);