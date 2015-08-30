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
            ref: 'User'
        },
        added_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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
            ref: 'Format',
            require: true
        }
    }
);

ArtworkSchema.statics.findByAdder = function(username, cb) {
    return this.find({ added_by: user_id }, cb);
};

module.exports = ArtworkSchema;