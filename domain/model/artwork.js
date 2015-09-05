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

console.log('registering Artwork model...');
module.exports = ArtworkModel;