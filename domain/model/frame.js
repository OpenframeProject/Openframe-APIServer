// dependancies
var mongoose = require('mongoose'),
    FrameSchema = require('../schema/frame'),
    FrameModel;

// Avoid recompilation
if (mongoose.models.FrameModel) {
    FrameModel = mongoose.model('FrameModel');
} else {
    FrameModel = mongoose.model('FrameModel', FrameSchema, 'frames');
}

module.exports = FrameModel;