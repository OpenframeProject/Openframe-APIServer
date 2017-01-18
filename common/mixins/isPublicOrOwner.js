var loopbackCtx = require('loopback-context'),
    debug = require('debug')('openframe:isPublicOrOwner');

/**
 * This mixin requires a model to have 'is_public: true' or the current user
 * to be the object's owner in order to provide access.
 */
module.exports = function(Model, options) {
    Model.observe('access', function(req, next) {
        var ctx = loopbackCtx.getCurrentContext(),
            currentUser = ctx && ctx.get('currentUser');

        debug('currentUser', currentUser);

        req.query.where = req.query.where || {};

        if (currentUser && !req.query.where.is_public) {
            req.query.where.or = [
                {is_public: true},
                {ownerId: currentUser.id}
            ];
        } else {
            req.query.where.is_public = true;
        }

        next();
    });
};
