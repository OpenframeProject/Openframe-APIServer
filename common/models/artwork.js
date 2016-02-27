module.exports = function(Artwork) {
    Artwork.disableRemoteMethod('createChangeStream', true);

    Artwork.stream = function(filter, cb) {
        filter = filter || {};
        var _filter = Object.assign({
            order: 'created DESC',
            limit: 25,
            where: {
                is_public: true
            }
        }, filter);
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
