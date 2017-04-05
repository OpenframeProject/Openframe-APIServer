var debug = require('debug')('openframe:model:Frame');

module.exports = function(Frame) {
    Frame.disableRemoteMethodByName('createChangeStream');

    // Remove sensitive data from Artworks being returned
    // in public frames
    // Frame.afterRemote('**', function(ctx, resultInstance, next) {
    //     debug('ctx.methodString', ctx.methodString);

    //     function updateResult(result) {
    //         if (result.current_artwork) {
    //             let newArtwork = {
    //                 title: result.current_artwork.title,
    //                 author_name: result.current_artwork.author_name
    //             };
    //             if (result.current_artwork.is_public) {    
    //                 newArtwork.id = result.current_artwork.id;
    //             }
    //             result.current_artwork(newArtwork);
    //             // debug(result.current_artwork);
    //         }
    //     }
    //     if (ctx.result) {
    //         if (Array.isArray(resultInstance)) {
    //             debug('isArray', resultInstance.length);
    //             ctx.result.forEach(function(result) {
    //                 updateResult(result);
    //             });
    //         } else {
    //             updateResult(ctx.result);
    //         }
    //     }
    //     next();
    // });

    // Never save 'current_artwork' object into DB -- it comes from relation, via currentArtworkId
    // TODO: I think this is a(nother) loopback bug, since with strict on we should be enforcing
    // properties, but since this property is the name of a relation it's allowing it to be saved (?)
    Frame.observe('before save', function(ctx, next) {
        debug('before save', typeof ctx.instance);
        if (ctx.instance) {
            ctx.instance.unsetAttribute('current_artwork');
        } else {
            delete ctx.data.current_artwork;
        }
        debug('before save - MODIFIED', ctx.instance);
        next();
    });

    // whenever a Frame model is saved, broadcast an update event
    Frame.observe('after save', function(ctx, next) {
        if (ctx.instance && Frame.app.pubsub) {
            debug('Saved %s %s', ctx.Model.modelName, ctx.instance.id);
            if (ctx.isNewInstance) {
                debug('New Frame, publishing: /user/' + ctx.instance.ownerId + '/frame/new');
                Frame.app.pubsub.publish('/user/' + ctx.instance.ownerId + '/frame/new', ctx.instance.id);
            } else {
                debug('Existing Frame, publishing: /frame/' + ctx.instance.id + '/db_updated');
                // debug(ctx.instance);
                Frame.findById(ctx.instance.id, { include: 'current_artwork' }, function(err, frame) {
                    debug(err, frame);
                    Frame.app.pubsub.publish('/frame/' + frame.id + '/db_updated', frame);
                });
            }
        }
        next();
    });

    // Ouch. Ow. Yowsers. Serisously?
    function removeManagers(frame, managers) {
        return new Promise((resolve, reject) => {
            frame.managers(function(err, current_managers) {
                debug(current_managers);
                if (current_managers.length) {
                    var count = 0,
                        total = current_managers.length;
                    current_managers.forEach(function(cur_man) {
                        debug(cur_man);
                        if (managers.indexOf(cur_man.username) === -1) {
                            debug('removing %s', cur_man.username);
                            frame.managers.remove(cur_man, function(err) {
                                if (err) debug(err);
                                count++;
                                if (count === total) {
                                    // all who are no longer present in the new list have been removed
                                    resolve();
                                }
                            });
                        } else {
                            count++;
                            if (count === total) {
                                // all who are no longer present in the new list have been removed
                                resolve();
                            }
                        }
                    });
                } else {
                    // there are no current managers
                    resolve();
                }
            });
        });
    }

    // Painful painful painful -- so gross. Why loopback, why!?
    function addManagers(frame, managers) {
        var OpenframeUser = Frame.app.models.OpenframeUser;

        return new Promise((resolve, reject) => {
            OpenframeUser.find({ where: { username: { inq: managers }}}, function(err, users) {
                if (err) {
                    debug(err);
                }
                var count = 0,
                    total = users.length;
                if (total === 0) {
                    // no managers found by username, return frame including current managers
                    Frame.findById(frame.id, {include: 'managers'}, function(err, frame) {
                        debug(err, frame);
                        resolve(frame);
                    });
                } else {
                    // managers found by username, add them to frame, then
                    // return frame including current managers
                    // XXX: Unfortunately loopback doesn't seem to provide a way to batch
                    // update hasAndBelongsToMany relationships :/
                    users.forEach(function(user) {
                        frame.managers.add(user, function(err) {
                            count++;
                            if (count === total) {
                                Frame.findById(frame.id, {include: 'managers'}, function(err, frame) {
                                    debug(err, frame);
                                    resolve(frame);
                                });
                            }
                        });
                    });
                }

            });
        });
    }

    // Update managers by username
    //
    // XXX: This is incredibly ugly. Loopback doesn't provide a good way to update
    // this type of relationship all in one go, which makes it a huge messy pain. Given
    // time, I may fix this.
    Frame.prototype.update_managers_by_username = function(managers, cb) {
        debug(managers);
        var self = this;

        removeManagers(self, managers)
            .then(function() {
                addManagers(self, managers)
                    .then(function(frame) {
                        cb(null, frame);
                    })
                    .catch(debug);
            }).catch(debug);
    };

    // Expose update_managers_by_username remote method
    Frame.remoteMethod(
        'prototype.update_managers_by_username', {
            description: 'Add a related item by username for managers.',
            accepts: {
                arg: 'managers',
                type: 'array',
                http: {
                    source: 'body'
                }
            },
            http: {
                verb: 'put',
                path: '/managers/by_username'
            },
            returns: {
                arg: 'frame',
                type: 'Object'
            }
        }
    );


    /**
     * Update the current artwork by artwork ID
     * @param  {String}   currentArtworkId
     * @param  {Function} callback
     */
    Frame.prototype.update_current_artwork = function(currentArtworkId, cb) {
        debug('update_current_artwork', currentArtworkId);
        var self = this;
        self.updateAttribute('currentArtworkId', currentArtworkId, function(err, instance) {
            cb(err, instance);
        });
    };

    Frame.remoteMethod(
        'prototype.update_current_artwork', {
            description: 'Set the current artwork for this frame',
            accepts: {
                arg: 'currentArtworkId',
                type: 'any',
                required: true,
                http: {
                    source: 'path'
                }
            },
            http: {
                verb: 'put',
                path: '/current_artwork/:currentArtworkId'
            },
            returns: {
                arg: 'frame',
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
    // Frame.prototype.toJSON = function() {
    //     // TODO: this seems awfully fragile... not very clear when context is available
    //     var ctx = loopback.getCurrentContext(),
    //         user = ctx.get('currentUser'),
    //         userId = user && user.id,
    //         obj = this.toObject(false, true, false);

    //     debug('FRAME toJSON', userId, obj);

    //     // Remove email from managers
    //     if (obj.managers && obj.managers.length) {
    //         obj.managers.forEach((manager) => {
    //             delete manager.email;
    //         });
    //     }

    //     // Remove email from owner unless it's the currently logged in user.
    //     if (obj.owner && userId !== obj.owner.id) {
    //         delete obj.owner.email;
    //     }

    //     return obj;
    // };
};

