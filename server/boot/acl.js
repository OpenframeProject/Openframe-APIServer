/*
Openframe-APIServer is the server component of Openframe, a platform for displaying digital art.
Copyright (C) 2017  Jonathan Wohl

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var debug = require('debug')('openframe:acl');

/**
 * Add custom dynamic ACL roles
 *
 * $frameManager - current user is a manager of the frame being accessed
 *
 */
module.exports = function(app) {
    var Role = app.models.Role;

    Role.registerResolver('$frameManager', function(role, context, cb) {

        // debug(context);

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
        context.model.findById(context.modelId, {include:{managers: true, owner: true}}, function(err, frame) {
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

