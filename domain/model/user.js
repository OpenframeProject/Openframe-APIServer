// dependancies
var mongoose = require('mongoose'),
    UserSchema = require('../schema/user'),
    UserModel;

// Avoid recompilation
if (mongoose.models.UserModel) {
    UserModel = mongoose.model('UserModel');
} else {
    UserModel = mongoose.model('UserModel', UserSchema, 'users');
}

module.exports = UserModel;