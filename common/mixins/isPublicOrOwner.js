var loopback = require('loopback'),
    debug = require('debug')('openframe:isPublicOrOwner');

/**
 * This mixin requires a model to have 'is_public: true' or the current user
 * to be the object's owner in order to provide access.
 */
module.exports = function(Model, options) {
    Model.observe('access', function(reqCtx, next) {
        var appCtx = loopback.getCurrentContext(),
            currentUser = appCtx && appCtx.get('currentUser');

        debug('currentUser', currentUser);

        reqCtx.query.where = reqCtx.query.where || {};

        if (currentUser) {
            reqCtx.query.where.or = [
                {is_public: true},
                {ownerId: currentUser.id}
            ];
        } else {
            reqCtx.query.where.is_public = true;
        }

        next();
    });
};
