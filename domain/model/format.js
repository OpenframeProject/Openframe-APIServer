// dependancies
var mongoose = require('mongoose'),
    FormatSchema = require('../schema/format'),
    FormatModel;

// Avoid recompilation
if (mongoose.models.FormatModel) {
    FormatModel = mongoose.model('FormatModel');
} else {
    FormatModel = mongoose.model('FormatModel', FormatSchema, 'formats');
}

module.exports = FormatModel;