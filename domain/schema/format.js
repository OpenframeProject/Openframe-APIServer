// dependancies
var Schema = require('mongoose').Schema;

var FormatSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        index: true
    },
    dependancies: {
        type: Array,
        default: []
    },
    install_script: {
        type: String
    },
    start_command: {
        type: String
    },
    end_command: {
        type: String
    },
    env_vars: {
        type: Array,
        default: []
    },
    player: {
        type: String,
        required: true
    },
    download: {
        type: Boolean,
        default: false
    }
});

module.exports = FormatSchema;
