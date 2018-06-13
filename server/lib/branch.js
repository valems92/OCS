'use strict';

var errorHandler = require('../utils/errorHandler');
var COLLECTION_NAME = 'branches';

module.exports = {
    addBranch: function (req, res) {
        var branch = req.body;

        req.DB.create(COLLECTION_NAME, branch, function (err, data) {
            if (err) {
                errorHandler.onError({message: "There was an error while creating the new branch"}, res);
            } else {
                res.json({branch: data});
            }
        });
    },

    deleteBranch: function (req, res) {
        var branchId = req.params.id;

        req.DB.findByIdAndRemove(COLLECTION_NAME, branchId, function (err) {
            if (err) {
                errorHandler.onError({message: "There was an error deleting the wanted branch"}, res);
            } else {
                res.json({message: 'Deleted'});
            }
        });
    },

    getBranches: function (req, res) {
        req.DB.find(COLLECTION_NAME, {}, function (err, branches) {
            if (err) {
                errorHandler.onError({message: "There was an error getting store branches"}, res);
            } else {
                res.json({branches: branches || []});
            }
        })
    }
};