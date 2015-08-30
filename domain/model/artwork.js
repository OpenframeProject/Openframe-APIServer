// dependancies
var mongoose = require('mongoose'),
    ArtworkSchema = require('../schema/artwork'),
    ArtworkModel;

// Avoid recompilation
if (mongoose.models.ArtworkModel) {
    ArtworkModel = mongoose.model('ArtworkModel');
} else {
    ArtworkModel = mongoose.model('ArtworkModel', ArtworkSchema, 'artwork');
}

module.exports = ArtworkModel;