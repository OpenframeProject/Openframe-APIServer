module.exports = function(Artwork) {
    Artwork.disableRemoteMethodByName('createChangeStream');
    Artwork.disableRemoteMethodByName('create');
};
