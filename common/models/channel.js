var loopback = require('loopback');

module.exports = function(Channel) {
    Channel.disableRemoteMethodByName('createChangeStream');

    /**
     * Ensure that only artworks that are public or are owned by the current user can be accessed.
     */
    // Channel.observe('access', function(ctx, next) {
    //     var context = loopback.getCurrentContext(),
    //         req = context && context.active ? context.active.http.req : null,
    //         user = req ? req.user : null;

    //     ctx.query.where = ctx.query.where || {};

    //     if (user) {
    //         ctx.query.where.or = [
    //             {is_public: true},
    //             {ownerId: user.id}
    //         ];
    //     } else {
    //         ctx.query.where.is_public = true;
    //     }

    //     next();
    // });
};
