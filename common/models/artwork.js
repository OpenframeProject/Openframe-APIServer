module.exports = function(Artwork) {
    Artwork.disableRemoteMethod('createChangeStream', true);

    Artwork.stream = function(filter, cb) {
        var _filter = filter || {};
        Object.assign(_filter, {
            order: 'created DESC',
            limit: 25
        });
        Artwork.find(_filter, function(err, artwork) {
            cb(null, artwork);
        });
    };

    Artwork.remoteMethod(
        'stream', {
            'http': {
                'verb': 'get'
            },
            accepts: {
                arg: 'filter',
                type: 'object'
            },
            returns: {
                arg: 'artwork',
                type: 'object'
            }
        }
    );
};
