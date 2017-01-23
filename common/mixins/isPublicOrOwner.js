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

//
// IMPORTANT NOTE
//
// As of Loopback 3.0, it's unclear whether or not this works.
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
};
