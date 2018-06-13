'use strict';

var errorHandler = require('../utils/errorHandler'),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId;

var COLLECTION_NAME = 'carts';

function _addToCart(req, res, token, doc) {
	var data = {
		clothId: req.body.clothId,
		status: "waiting",
		added: Date.now()
	};

	var alreadyExist = false;
	for (var i = 0; i < doc.cart.length; i++) {
		if (doc.cart[i].get("clothId").toString() === data.clothId && doc.cart[i].get("status") === "waiting") {
			alreadyExist = true;
			break;
		}
	}

	if (alreadyExist) {
		errorHandler.onError({message: "This cloth is already in you cart"}, res);
	} else {
		var _doc = doc._doc;
		_doc.cart.push(data);

		req.DB.findByIdAndUpdate(COLLECTION_NAME, token._id, _doc, function (err, data) {
			if (err) {
				errorHandler.onError({message: "There was an error while adding to cart"}, res);
			} else {
				res.json(data._doc);
			}
		});
	}
}

function _buyCart(req, res, token, doc) {
	var date = Date.now();
	var _doc = doc._doc;
	for (var i = 0; i < _doc.cart.length; i++) {
		if (_doc.cart[i].status === "waiting") {
			_doc.cart[i].status = "purchased";
			_doc.cart[i].purchased = date;
		}
	}

	req.DB.findByIdAndUpdate(COLLECTION_NAME, token._id, _doc, function (err, data) {
		if (err) {
			errorHandler.onError({message: "There was an error while buying the cart"}, res);
		} else {
			res.json(data._doc);
		}
	});
}

module.exports = {
	createCart: function (req, id, cb) {
		var cart = {
			_id: id,
			cart: []
		};

		req.DB.create(COLLECTION_NAME, cart, cb);
	},

	getCart: function (req, res) {
		var token = req.decoded;

		req.DB.findById(COLLECTION_NAME, token._id, function (err, doc) {
			if (err) {
				if (err.name === "DocumentNotFoundError") {
					this.createCart(req, token._id, function (err, cart) {
						if (err) {
							errorHandler.onError({message: "There was an error getting your cart"}, res);
						} else {
							res.json(cart._doc);
						}
					})
				} else {
					errorHandler.onError({message: "There was an error getting your cart"}, res);
				}
			} else {
				res.json(doc._doc);
			}
		});
	},

	addToCart: function (req, res) {
		var token = req.decoded;

		req.DB.findById(COLLECTION_NAME, token._id, function (err, doc) {
			if (err) {
				if (err.name === "DocumentNotFoundError") {
					this.createCart(req, token._id, function (err, cart) {
						if (err) {
							errorHandler.onError({message: "There was an error getting your cart"}, res);
						} else {
							_addToCart(req, res, token, cart);
						}
					})
				} else {
					errorHandler.onError({message: "There was an error getting your cart"}, res);
				}
			} else {
				if (doc) {
					_addToCart(req, res, token, doc);
				} else {
					errorHandler.onError({message: "There was an error getting your cart"}, res);
				}
			}
		});
	},

	buyCart: function (req, res) {
		var token = req.decoded;

		req.DB.findById(COLLECTION_NAME, token._id, function (err, doc) {
			if (err) {
				if (err.name === "DocumentNotFoundError") {
					this.createCart(req, token._id, function (err, cart) {
						if (err) {
							errorHandler.onError({message: "There was an error getting your cart"}, res);
						} else {
							_buyCart(req, res, token, cart);
						}
					})
				} else {
					errorHandler.onError({message: "There was an error getting your cart"}, res);
				}
			} else {
				_buyCart(req, res, token, doc);
			}
		});
	},

	removeFromCart: function (req, res) {
		var token = req.decoded;
		var clothId = req.params.id;

		req.DB.findById(COLLECTION_NAME, token._id, function (err, doc) {
			if (err) {
				errorHandler.onError({message: "There was an error getting your cart"}, res);
			} else {
				for (var i = 0; i < doc.cart.length; i++) {
					if (doc.cart[i].get("clothId").toString() === clothId && doc.cart[i].get("status") === "waiting") {
						doc.cart.splice(i, 1);
						break;
					}
				}

				req.DB.findByIdAndUpdate(COLLECTION_NAME, token._id, doc, function (err, data) {
					if (err) {
						errorHandler.onError({message: "There was an error while removing from cart"}, res);
					} else {
						res.json(data._doc);
					}
				});
			}
		});
	},

	getPurchases: function (req, res) {
		var token = req.decoded;

		var id = ObjectId(token._id);
		req.DB.aggregate(COLLECTION_NAME, [
			{$match: {_id: id}},
			{$unwind: "$cart"},
			{$match: {"cart.status": "purchased"}},
			{$lookup: {from: "clothes", localField: "cart.clothId", foreignField: "_id", as: "cloth"}},
			{$unwind: "$cloth"},
			{$replaceRoot: {newRoot: "$cloth"}},
			{$group: {_id: "$provider", count: {$sum: 1}, colors: {$push: "$color"}}}
		], function (data) {
			res.json({data: data})
		})
	},

	getAllPurchases(req, res) {
		req.DB.aggregate(COLLECTION_NAME, [
			{$unwind: "$cart"},
			{$match: {"cart.status": "purchased"}},
			{$lookup: {from: "clothes", localField: "cart.clothId", foreignField: "_id", as: "cloth"}},
			{$unwind: "$cloth"},
			{$replaceRoot: {newRoot: "$cloth"}}
		], function (data) {
			res.json({data: data})
		})
	}
};