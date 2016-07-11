var loopback = require('loopback'),
    _ = require('lodash'),
    debug = require('debug')('openframe:model:Artwork'),
    addLikedToReq = require('../../helpers').addLikedToReq;

module.exports = function(Artwork) {
    Artwork.disableRemoteMethod('createChangeStream', true);
    Artwork.disableRemoteMethod('create', true);

    // // Add a computed 'liked' value to each artwork object at runtime
    // Artwork.observe('loaded', function(ctx, next) {
    //     // We don't act on new instances
    //     if (!ctx.instance) {
    //         return next();
    //     }
    //     debug('loaded', ctx.instance.id);

    //     var context = loopback.getCurrentContext(),
    //         req = context && context.active ? context.active.http.req : null,
    //         user = req ? req.user : null,
    //         liked_artwork = req ? req.liked_artwork : null;

    //     debug('liked_artwork', liked_artwork);

    //     ctx.instance.liked = false;

    //     if (user && liked_artwork) {
    //         if (liked_artwork.indexOf(ctx.instance.id.toString()) !== -1) {
    //             ctx.instance.liked = true;
    //         }
    //         next();
    //     } else {
    //         next();
    //     }
    // });

    // Another ugly hack...
    //
    // Add this user's liked_artwork to the request object
    // so that we can check it in the 'loaded' hook without making a god damn database call
    // (the db call f's up sort order, loopback issue submitted)
    // Artwork.beforeRemote('stream', addLikedToReq);

    // Artwork.stream = function(filter, cb) {
    //     filter = filter || {};

    //     var context = loopback.getCurrentContext(),
    //         req = context && context.active ? context.active.http.req : null,
    //         user = req ? req.user : null,
    //         liked_artwork = req.liked_artwork || null;

    //     debug('LIKED ART:', req.liked_artwork);

    //     var _filter = Object.assign({
    //         order: 'created DESC',
    //         limit: 25,
    //         where: {
    //             is_public: true
    //         }
    //     }, filter);
    //     debug('_filter', _filter);
    //     Artwork.find(_filter, function(err, artwork) {
    //         // XXX: it seems like the combo of beforeRemote and observe('loaded') will get us
    //         // a computed 'liked' property and preserve sort order. Mother of GOD!
    //         //
    //         // if (liked_artwork && liked_artwork.length) {
    //         //     artwork.forEach(function(art) {
    //         //         if (liked_artwork.indexOf(art.id.toString()) !== -1) {
    //         //             art.liked = true;
    //         //         } else {
    //         //             art.liked = false;
    //         //         }
    //         //     });
    //         // }
    //         cb(null, artwork);
    //     });
    // };

    // Artwork.remoteMethod(
    //     'stream', {
    //         'http': {
    //             'verb': 'get'
    //         },
    //         accepts: {
    //             arg: 'filter',
    //             type: 'object'
    //         },
    //         returns: {
    //             arg: 'artwork',
    //             type: 'object'
    //         }
    //     }
    // );
};
