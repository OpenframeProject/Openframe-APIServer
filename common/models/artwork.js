var debug = require('debug')('openframe:model:Artwork');

module.exports = function(Artwork) {
    Artwork.disableRemoteMethodByName('createChangeStream');
    Artwork.disableRemoteMethodByName('create');
};
