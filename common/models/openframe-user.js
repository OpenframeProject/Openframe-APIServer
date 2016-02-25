var loopback = require('loopback'),
    debug = require('debug')('openframe:model:OpenframeUser');

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

    // Get all frames, owned and managed
    OpenframeUser.prototype.all_frames = function(cb) {
        var self = this,
            allFrames;
        self.owned_frames({include: 'managers'},function(err, _ownFrames) {
            var ownFrames = _ownFrames || [];
            self.managed_frames({
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

    // Expose all_frames remote method
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

    // Get the first collection for this user -- this will be the 'primary' user
    OpenframeUser.prototype.primary_collection = function(cb) {
        var collection;

        this.collections({
            include: {
                relation: 'artwork',
                scope: {
                    order: 'created DESC'
                }
            }
        }, function(err, cols) {
            collection = cols && cols.length ? cols[0] : null;
            cb(null, collection);
        });
    };

    // Expose primary_collection remote method
    OpenframeUser.remoteMethod(
        'primary_collection', {
            description: 'Get the first collection for this user.',
            accepts: [],
            http: {
                verb: 'get',
                path: '/collections/primary'
            },
            isStatic: false,
            returns: {
                arg: 'collection',
                type: 'Array'
            }
        }
    );

    // Post a new artwork to this user's primary collection
    OpenframeUser.prototype.primary_collection_add_artwork = function(artwork, cb) {
        artwork.ownerId = this.id;
        this.primary_collection(function(err, collection) {
            if (collection) {
                collection.artwork.create(artwork, function(err, artwork) {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, artwork);
                });
            }
        });
    };

    // Expose primary_collection remote method
    OpenframeUser.remoteMethod(
        'primary_collection_add_artwork', {
            description: 'Add a new artwork to the user\'s primary collection',
            accepts: {
                arg: 'artwork',
                type: 'Object',
                http: {
                    source: 'body'
                }
            },
            http: {
                verb: 'post',
                path: '/collections/primary/artwork'
            },
            isStatic: false,
            returns: {
                arg: 'artwork',
                type: 'Object'
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
            req = ctx && ctx.active ? ctx.active.http.req : null,
            user = req ? req.user : null,
            obj = this.toObject(false, true, false);

        // if this isn't the currently logged in user, don't display email address
        if (!user || this.id !== user.id) {
            delete obj.email;
        }

        return obj;
    };



};
