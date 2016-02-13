var debug = require('debug')('loopback:security:frameManager');

/**
 * Add custom dynamic ACL roles
 *
 * $frameManager - current user is a manager of the frame being accessed
 *
 */
module.exports = function(app) {
    debug('TEST TEST TEST');
    var Role = app.models.Role;

    Role.registerResolver('$frameManager', function(role, context, cb) {
        debug(context);

        var req = context && context.active ? context.active.http.req : null,
            user = req ? req.user : null;

        function reject(err) {
            debug('reject:', err);
            if (err) {
                return cb(err);
            }
            cb(null, false);
        }

        if (context.modelName !== 'Frame') {
            // the target model is not a Frame
            return reject();
        }


        if (!user.id) {
            // do not allow anonymous users
            return reject();
        }

        // get current frame
        context.model.findById(context.modelId, function(err, frame) {
            if (err || !frame) {
                return reject(err);
            }

            // if user is $owner, allow
            // XXX: Hack to work around $frameManager role taking precedence of $owner
            Role.isOwner(context.model, context.modelId, user.id, function(err, owner) {
                if (owner) {
                    return cb(null, true);
                }
                frame.managers.findById(user.id, function(err, manager) {
                    if (err || !manager) {
                        return reject(err);
                    }
                    cb(null, true);
                });
            });

        });
    });
};

