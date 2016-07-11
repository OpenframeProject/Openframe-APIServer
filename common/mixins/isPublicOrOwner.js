var loopback = require('loopback');

/**
 * This mixin requires a model to have 'is_public: true' or the current user
 * to be the object's owner in order to provide access.
 */
module.exports = function(Model, options) {
    Model.observe('access', function(ctx, next) {
        var context = loopback.getCurrentContext(),
            req = context && context.active ? context.active.http.req : null,
            user = req ? req.user : null;

        ctx.query.where = ctx.query.where || {};

        if (user) {
            ctx.query.where.or = [
                {is_public: true},
                {ownerId: user.id}
            ];
        } else {
            ctx.query.where.is_public = true;
        }

        next();
    });
};
