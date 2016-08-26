var debug = require('debug')('openframe:apiserver:model:Frame'),
    loopback = require('loopback');

module.exports = function(Frame) {
    Frame.disableRemoteMethod('createChangeStream', true);

    // whenever a Frame model is saved, broadcast an update event
    Frame.observe('after save', function(ctx, next) {
        if (ctx.instance && Frame.app.pubsub) {
            debug('Saved %s#%s', ctx.Model.modelName, ctx.instance.id);
            if (ctx.isNewInstance) {
                debug('New Frame, publishing: /user/' + ctx.instance.ownerId + '/frame/new');
                Frame.app.pubsub.publish('/user/' + ctx.instance.ownerId + '/frame/new', ctx.instance.id);
            } else {
                debug('Existing Frame, publishing: /frame/' + ctx.instance.id + '/db_updated');
                debug(ctx.instance);
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
                if (current_managers.length) {
                    var count = 0,
                        total = current_managers.length;
                    current_managers.forEach(function(cur_man) {
                        if (managers.indexOf(cur_man.username) === -1) {
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
        'update_managers_by_username', {
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
            isStatic: false,
            returns: {
                arg: 'frame',
                type: 'Object'
            }
        }
    );
};

