// dependancies
var Schema = require('mongoose').Schema;

var FormatSchema = new Schema({
        name: {
            type: String,
            required: true,
            index: true
        },
        player: {
            type: String,
            required: true
        }
    }
);

module.exports = FormatSchema;