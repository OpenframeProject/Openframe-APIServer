var debug = require('debug')('loopback:security:frameManager');

/**
 * Add custom dynamic ACL roles
 *
 * $frameManager - current user is a manager of the frame being accessed
 *
 */
module.exports = function(app) {
    var Role = app.models.Role;

    Role.registerResolver('$frameManager', function(role, context, cb) {

        debug(context);

        function reject(err) {
            debug('reject:', err);
            if (err) {
                return cb(err);
            }
            cb(null, false);
        }

        // $frameManager is only applicabale to Frame models
        if (context.modelName !== 'Frame') {
            // the target model is not a Frame
            return reject();
        }

        // do not allow anonymous users
        var userId = context.accessToken.userId;
        if (!userId) {
          return reject();
        }

        // get current frame
        context.model.findById(context.modelId, { include:{ managers: true, owner: true }}, function(err, frame) {
            if (err || !frame) {
                return reject(err);
            }

            // if user is $owner, allow
            // XXX: Hack to work around $frameManager role taking precedence of $owner
            Role.isOwner(context.model, context.modelId, userId, function(err, owner) {
                if (owner) {
                    return cb(null, true);
                }
                frame.managers.findById(userId, function(err, manager) {
                    if (err || !manager) {
                        return reject(err);
                    }
                    cb(null, true);
                });
            });

        });
    });
};

