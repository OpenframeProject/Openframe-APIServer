module.exports = function(Artwork) {
    Artwork.disableRemoteMethod('createChangeStream', true);
};
