module.exports = function(Artwork) {
    Artwork.disableRemoteMethod('createChangeStream', true);

    Artwork.stream = function(cb) {
        Artwork.find({
            order: 'created DESC'
        }, function(err, artwork) {
            cb(null, artwork);
        });
    };

    Artwork.remoteMethod(
        'stream', {
            'http': {
                'verb': 'get'
            },
            returns: {
                arg: 'artwork',
                type: 'object'
            }
        }
    );
};
