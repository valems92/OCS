'use strict';

module.exports = {
    onError: function (err, res) {
        res.status(err.code || 500).json({
            status: 'Error',
            message: err.message
        });
    }
};