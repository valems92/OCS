var errorHandler = require('../utils/errorHandler'),
    jwt = require('jsonwebtoken');

function validToken(req, res, cb) {
    var token = req.headers['authorization'];
    if (!token) {
        errorHandler.onError({message: 'No token provided'}, res);
    } else {
        jwt.verify(token, 'secret', cb);
    }
}

module.exports = {
    authUser: function (req, res, next) {
        validToken(req, res, function (err, decoded) {
            if (err) {
                errorHandler.onError({message: "Token invalid"}, res);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    },

    authAdmin: function (req, res, next) {
        validToken(req, res, function (err, decoded) {
            if (err) {
                errorHandler.onError({message: "Token invalid"}, res);
            } else {
                if (decoded.role !== "admin") {
                    errorHandler.onError({message: "Invalid authorization"}, res);
                } else {
                    req.decoded = decoded;
                    next();
                }
            }
        });
    }
};