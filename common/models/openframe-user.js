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
     * On artwork create, add to the current user's primary collection.
     */
    OpenframeUser.afterRemote('prototype.__create__owned_artwork', function(ctx, modelInstance, next) {
        debug('afterRemote prototype.__create__owned_artwork', modelInstance);
        var req = ctx.req,
            user = req.user,
            artwork = ctx.result;

        // this shouldn't happen since auth is required to create artwork
        if (!user) {
            return next();
        }

        if (artwork) {
            user.primary_collection(function(err, collection) {
                if (collection) {
                    collection.artwork.add(artwork, function(err) {
                        if (err) {
                            next(err);
                        } else {
                            next();
                        }
                    });
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    });


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





    // Get the first collection for this user -- this will be the 'primary' collection
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
    OpenframeUser.prototype.primary_collection_new_artwork = function(artwork, cb) {
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
    OpenframeUser.remoteMethod(
        'primary_collection_new_artwork', {
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





    // Add an existing artwork to this user's primary collection
    OpenframeUser.prototype.primary_collection_add_artwork = function(artworkId, cb) {
        var Artwork = OpenframeUser.app.models.Artwork,
            self = this;
        Artwork.findById(artworkId, function(err, artwork) {
            if (err) {
                return cb(err);
            }
            self.primary_collection(function(err, collection) {
                if (collection) {
                    collection.artwork.add(artwork, function(err, artwork) {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, artwork);
                    });
                }
            });
        });
    };
    OpenframeUser.remoteMethod(
        'primary_collection_add_artwork', {
            description: 'Add an existing artwork to the user\'s primary collection',
            accepts: {
                arg: 'artwork',
                type: 'Object',
                http: {
                    source: 'body'
                }
            },
            http: {
                verb: 'put',
                path: '/collections/primary/artwork/:artworkId'
            },
            isStatic: false,
            returns: {
                arg: 'artwork',
                type: 'Object'
            }
        }
    );





    // Add an existing artwork to this user's liked_artwork and primary collection
    OpenframeUser.prototype.like_artwork = function(artworkId, cb) {
        var Artwork = OpenframeUser.app.models.Artwork,
            self = this;

        Artwork.findById(artworkId, function(err, artwork) {
            if (err) {
                return cb(err);
            }

            artwork.likers.add(self, function(err, relation) {
                if (err) {
                    debug(err);
                    cb(err);
                } else {
                    debug(relation);
                    self.primary_collection(function(err, collection) {
                        if (err || !collection) {
                            debug(err);
                            cb(err);
                        }
                        if (collection) {
                            collection.artwork.add(artwork, function(err, artwork) {
                                if (err) {
                                    return cb(err);
                                }
                                cb(null, relation);
                            });
                        }
                    });
                }
            });
        });
    };
    OpenframeUser.remoteMethod(
        'like_artwork', {
            description: 'Add an existing artwork to the user\'s liked_artwork and primary collection',
            accepts: {
                arg: 'artworkId',
                type: 'String',
                required: true,
                http: {
                    source: 'path'
                }
            },
            http: {
                verb: 'put',
                path: '/artwork/like/:artworkId'
            },
            isStatic: false,
            returns: {
                arg: 'relation',
                type: 'Object'
            }
        }
    );





    // Remove an existing artwork from this user's liked_artwork and primary collection
    OpenframeUser.prototype.unlike_artwork = function(artworkId, cb) {
        var Artwork = OpenframeUser.app.models.Artwork,
            self = this;

        Artwork.findById(artworkId, function(err, artwork) {
            if (err) {
                return cb(err);
            }

            artwork.likers.remove(self, function(err) {
                if (err) {
                    debug(err);
                    cb(err);
                } else {
                    // if this user is the owner, can't remove from primary collection.
                    debug(artwork.ownerId, self.id);
                    if (artwork.ownerId === self.id) {
                        return cb(null);
                    }
                    self.primary_collection(function(err, collection) {
                        if (err || !collection) {
                            debug(err);
                            cb(err);
                        }
                        if (collection) {
                            collection.artwork.remove(artwork, function(err) {
                                if (err) {
                                    return cb(err);
                                }
                                cb(null);
                            });
                        }
                    });
                }
            });
        });
    };
    OpenframeUser.remoteMethod(
        'unlike_artwork', {
            description: 'Remove an existing artwork from this user\'s liked_artwork and primary collection',
            accepts: {
                arg: 'artworkId',
                type: 'String',
                required: true,
                http: {
                    source: 'path'
                }
            },
            http: {
                verb: 'put',
                path: '/artwork/unlike/:artworkId'
            },
            isStatic: false,
            returns: {
                arg: 'relation',
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
