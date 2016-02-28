var loopback = require('loopback'),
    debug = require('debug')('openframe:model:Artwork');

module.exports = function(Artwork) {
    Artwork.disableRemoteMethod('createChangeStream', true);
    Artwork.disableRemoteMethod('create', true);


    // Add a computed 'liked' value to each artwork object at runtime
    Artwork.observe('loaded', function(ctx, next) {
        debug('loaded observed');
        // We don't act on new instances
        if (!ctx.instance) {
            return next();
        }

        var context = loopback.getCurrentContext(),
            req = context && context.active ? context.active.http.req : null,
            user = req ? req.user : null;

        ctx.instance.liked = false;

        if (user) {
            user.liked_artwork.exists(ctx.instance.id, function(err, exists) {
                if (exists) {
                    ctx.instance.liked = true;
                }
                next();
            });
        } else {
            next();
        }
    });

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
