//
// IMPORTANT NOTE
//
// As of Loopback 3.0, this no longer works. For the time being, we're removing the built-in find remote method and
// replacing it with our own which automatically filters out is_public: false things.
//

var debug = require('debug')('openframe:isPublicOrOwner');

/**
 * This mixin requires a model to have 'is_public: true' or the current user
 * to be the object's owner in order to provide access.
 */
module.exports = function(Model, options) {



    Model.observe('access', function(req, next) {
        debug(options, req.options.accessToken);

        let userId = req.options.accessToken && req.options.accessToken.userId;

        // var ctx = loopbackCtx.getCurrentContext(),
        //     currentUser = ctx && ctx.get('currentUser');

        // debug('currentUser', currentUser);

        debug(req.query);

        req.query.where = req.query.where || {};

        if (userId && !req.query.where.is_public) {
            req.query.where.or = [
                {is_public: true},
                {ownerId: userId}
            ];
        } else {
            req.query.where.is_public = true;
        }

        debug(req.query);

        next();
    });

    /*
    Model.observe('loaded', function(ctx, next) {
        debug(ctx);

        let userId = ctx.options.accessToken && ctx.options.accessToken.userId;

        if (ctx.data && !ctx.data.is_public && ctx.data.ownerId !== userId) {
            delete ctx.data;
        }

        debug(ctx.data);
        // var ctx = loopbackCtx.getCurrentContext(),
        //     currentUser = ctx && ctx.get('currentUser');

        // debug('currentUser', currentUser);

        // debug(req.query);

        // debug(ctx.data);


        // req.query.where = req.query.where || {};

        // if (userId && !req.query.where.is_public) {
        //     req.query.where.or = [
        //         {is_public: true},
        //         {ownerId: userId}
        //     ];
        // } else {
        //     req.query.where.is_public = true;
        // }

        // debug(req.query);

        next();
    });
     */
};
