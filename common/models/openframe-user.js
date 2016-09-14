var loopback = require('loopback'),
    debug = require('debug')('openframe:model:OpenframeUser'),
    addLikedToReq = require('../../helpers').addLikedToReq;

module.exports = function(OpenframeUser) {


    /**
     * Disable specific default remote methods
     */

    OpenframeUser.disableRemoteMethod('createChangeStream', true);
    OpenframeUser.disableRemoteMethod('updateAll', true);

    OpenframeUser.disableRemoteMethod('__count__accessTokens', false);
    OpenframeUser.disableRemoteMethod('__create__accessTokens', false);
    OpenframeUser.disableRemoteMethod('__delete__accessTokens', false);
    OpenframeUser.disableRemoteMethod('__destroyById__accessTokens', false);
    OpenframeUser.disableRemoteMethod('__findById__accessTokens', false);
    OpenframeUser.disableRemoteMethod('__get__accessTokens', false);
    OpenframeUser.disableRemoteMethod('__updateById__accessTokens', false);

    OpenframeUser.disableRemoteMethod('__count__credentials', false);
    OpenframeUser.disableRemoteMethod('__create__credentials', false);
    OpenframeUser.disableRemoteMethod('__delete__credentials', false);
    OpenframeUser.disableRemoteMethod('__destroyById__credentials', false);
    OpenframeUser.disableRemoteMethod('__findById__credentials', false);
    OpenframeUser.disableRemoteMethod('__get__credentials', false);
    OpenframeUser.disableRemoteMethod('__updateById__credentials', false);

    OpenframeUser.disableRemoteMethod('__count__credentials', false);
    OpenframeUser.disableRemoteMethod('__create__credentials', false);
    OpenframeUser.disableRemoteMethod('__delete__credentials', false);
    OpenframeUser.disableRemoteMethod('__destroyById__credentials', false);
    OpenframeUser.disableRemoteMethod('__findById__credentials', false);
    OpenframeUser.disableRemoteMethod('__get__credentials', false);
    OpenframeUser.disableRemoteMethod('__updateById__credentials', false);

    OpenframeUser.disableRemoteMethod('__count__identities', false);
    OpenframeUser.disableRemoteMethod('__create__identities', false);
    OpenframeUser.disableRemoteMethod('__delete__identities', false);
    OpenframeUser.disableRemoteMethod('__destroyById__identities', false);
    OpenframeUser.disableRemoteMethod('__findById__identities', false);
    OpenframeUser.disableRemoteMethod('__get__identities', false);
    OpenframeUser.disableRemoteMethod('__updateById__identities', false);


    /**
     * CUSTOM remote methods
     */


    // Get configuration via REST endpoint
    OpenframeUser.config = function(cb) {
        var config = {
            pubsub_url: OpenframeUser.app.get('ps_url')
        };
        cb(null, config);
    };

    // Expose all_frames remote method
    OpenframeUser.remoteMethod(
        'config', {
            description: 'Get some general config info from the API server.',
            accepts: [],
            http: {
                verb: 'get',
            },
            isStatic: true,
            returns: {
                arg: 'config',
                type: 'Object'
            }
        }
    );





    // Get all frames, owned and managed
    OpenframeUser.prototype.all_frames = function(cb) {
        var self = this,
            allFrames;
        self.owned_frames({include: ['managers', 'current_artwork']},function(err, _ownFrames) {
            var ownFrames = _ownFrames || [];
            self.managed_frames({
                include: 'current_artwork',
                where: {
                    ownerId: {
                        neq: self.id
                    }
                }
            }, function(err, _manFrames) {
                var manFrames = _manFrames || [];
                allFrames = ownFrames.concat(manFrames);
                cb(null, allFrames);
            });
        });
    };
    OpenframeUser.remoteMethod(
        'all_frames', {
            description: 'Get all frames (owned and managed) by this user.',
            accepts: [],
            http: {
                verb: 'get',
                path: '/all_frames'
            },
            isStatic: false,
            returns: {
                arg: 'frames',
                type: 'Array'
            }
        }
    );

    /**
     * Override toJSON in order to remove inclusion of email address for users that are
     * not the currently logged-in user.
     *
     * @return {Object} Plain JS Object which will be transformed to JSON for output.
     */
    OpenframeUser.prototype.toJSON = function() {
        // TODO: this seems awfully fragile... not very clear when context is available
        var ctx = loopback.getCurrentContext(),
            user = ctx.get('currentUser'),
            userId = user && user.id,
            obj = this.toObject(false, true, false);

        debug('USER toJSON', userId, obj);
        // if this isn't the currently logged in user, don't display email address
        if (!userId || this.id.toString() !== userId.toString()) {
            delete obj.email;
        }

        return obj;
    };



};
