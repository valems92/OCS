'use strict';
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;

var UseSchema = new Schema({
    fullName: {
        type: String,
        default: 'User Name'
    },
    email: {
        required: [true, 'Email is required'],
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    password: {
        required: [true, 'Password is required'],
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    }
}, { id: true });

UseSchema.pre('save', function (next) {
    var user = this;

    // Validate password
    var regExp = new RegExp((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/));
    var validPassword = regExp.test(user.password);
    if (!validPassword) {
        next(new Error('password must be at least 8 characters with lowercase letters, uppercase letters and digits'));
    }

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }

    // Hash and set password
    var hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    next();
});

UseSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
};

module.exports = mongoose.model('users', UseSchema);

