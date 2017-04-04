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

    // If the mixin specifies specific methods, add remote hooks for those only,
    // otherwise add global hook for all methods
    if (options.methods) {
        options.methods.forEach((method) => {
            Model.afterRemote(method, function(ctx, resultInstance, next) {
                modifyResults(ctx, resultInstance, next);
            });
        });
        // Used ONLY to find the method name -- not sure where else to look this up? It's
        // probably buried in loopback docs somewhere?
        // Model.afterRemote('**', function(ctx, resultInstance, next) {
        //     debug('ctx.methodString', ctx.methodString);
        // });
    } else {
        Model.afterRemote('**', function(ctx, resultInstance, next) {
            modifyResults(ctx, resultInstance, next);
        });
    }

    // Modify the results to include only those which are public or owned-by current user
    function modifyResults(ctx, resultInstance, next) {
        debug('ctx.methodString', ctx.methodString);

        debug('ctx.req.accessToken', ctx.req.accessToken);

        let userId = ctx.req.accessToken && ctx.req.accessToken.userId;

        // if result is true, we want to reject this item
        function allowResult(model) {
            debug('model', model.is_public, model.ownerId, userId);
            return (model.is_public || (userId && model.ownerId && model.ownerId.toString() === userId.toString()));
        }

        if (ctx.result) {
            let newResult;
            if (Array.isArray(resultInstance)) {
                debug('isArray', resultInstance.length);
                newResult = [];
                ctx.result.forEach(function(result) {
                    if (allowResult(result)) {
                        newResult.push(result);
                    } else {
                        debug('Rejecting result', result.id);
                    }
                });
            } else if (allowResult(ctx.result)) {
                newResult = ctx.result;
            } else {
                debug('Rejecting result', resultInstance.id);
                ctx.res.status(404).render('404');
            }
            ctx.result = newResult;
        }

        next();
    }
};
