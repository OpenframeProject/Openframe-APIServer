var loopback = require('loopback'),
    debug = require('debug')('openframe:model:Artwork');

module.exports = function(Artwork) {
    Artwork.disableRemoteMethod('createChangeStream', true);
    Artwork.disableRemoteMethod('create', true);

    // Add a dynamic 'liked' value to the artwork object based on logged in user's liked_artwork
    // relationship
    Artwork.computedLiked = function(artwork) {
        // TODO: this seems fragile...
        var ctx = loopback.getCurrentContext(),
            req = ctx && ctx.active ? ctx.active.http.req : null,
            user = req ? req.user : null;

        return new Promise((resolve, reject) => {
            if (user) {
                artwork.likers(function(err, likers) {
                    if (err || likers === null) {
                        return resolve(false);
                    }
                    // zip through the likers... if this user is one, resolve with true
                    likers.forEach(function(liker) {
                        if (liker.id === user.id) {
                            return resolve(true);
                        }
                    });
                    return resolve(false);
                });
            } else {
                return resolve(false);
            }
        });
    };

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
