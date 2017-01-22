var debug = require('debug')('openframe:model:Artwork');

module.exports = function(Artwork) {
    Artwork.disableRemoteMethodByName('createChangeStream');
    Artwork.disableRemoteMethodByName('create');
    // Artwork.disableRemoteMethodByName('find');

    // Emulate default scope but with more flexibility.
    // const queryOnlyPublic = { is_public: true };

    // Artwork.once('attached', function() {
    //     const _find = Artwork.find;

    //     Artwork.remoteFind = function(query = {}, ...rest) {
    //         if (!query.where || Object.keys(query.where).length === 0) {
    //             query.where = queryOnlyPublic;
    //         } else {
    //             // for remoteFind, is_public is ALWAYS true.
    //             query.where.is_public = true;
    //             query.where = {
    //                 and: [query.where]
    //             };
    //         }

    //         return _find.call(Artwork, query, ...rest);
    //     };

    //     Artwork.remoteMethod(
    //         'remoteFind', {
    //             description: 'Get all public artworks.',
    //             accepts: [{arg: 'filter', type: 'object'}],
    //             http: {
    //                 verb: 'get',
    //                 path: '/'
    //             },
    //             returns: {
    //                 root: true,
    //                 type: 'Array'
    //             }
    //         }
    //     );
    // });


    // Artwork.afterRemote('*', function(ctx, artwork, next) {
    //     let userId = ctx.options.accessToken && ctx.options.accessToken.userId;

    //     debug(ctx.result);

    //     // if result is true, we want to reject this item
    //     function check(work) {
    //         return (!work.is_public && work.ownerId !== userId);
    //     }

    //     if (ctx.result) {
    //         if (Array.isArray(ctx.result)) {
    //             ctx.result.forEach(function(result, idx, srcAry) {
    //                 if (check(result)) {
    //                     debug('Rejecting result', result.id);
    //                     srcAry.splice(idx, 1);
    //                 }
    //             });
    //         } else if (artwork && check(artwork)) {
    //             debug('Rejecting result', result.id);
    //             throw('Bad artwork');
    //         }
    //     }

    //     next();
    // });
};
