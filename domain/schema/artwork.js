'use strict';
// dependancies
var Schema = require('mongoose').Schema;

var ArtworkSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String
    },
    url: {
        type: String,
        require: true
    },
    author_name: {
        type: String
    },
    author_user: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    added_by: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
        require: true
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    updated_on: {
        type: Date,
        default: Date.now
    },
    is_public: {
        type: Boolean,
        default: true,
        required: true
    },
    format: {
        type: Schema.Types.ObjectId,
        ref: 'FormatModel',
        require: true
    }
});

ArtworkSchema.statics.findByAdder = function(username, cb) {
    return this.find({
        added_by: username
    }, cb);
};

ArtworkSchema.statics.random = function(callback) {
    this.count(function(err, count) {
        if (err) {
            return callback(err);
        }
        var rand = Math.floor(Math.random() * count);
        this.findOne().populate('format').skip(rand).exec(callback);
    }.bind(this));
};

module.exports = ArtworkSchema;
