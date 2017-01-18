var loopback = require('loopback'),
    loopbackCtx = require('loopback-context'),
    path = require('path'),
    debug = require('debug')('openframe:model:OpenframeUser');


module.exports = function(OpenframeUser) {


    /**
     * Disable specific default remote methods
     */

    OpenframeUser.disableRemoteMethodByName('createChangeStream', true);
    OpenframeUser.disableRemoteMethodByName('updateAll', true);

    // OpenframeUser.disableRemoteMethodByName('__count__accessTokens', false);
    // OpenframeUser.disableRemoteMethodByName('__create__accessTokens', false);
    // OpenframeUser.disableRemoteMethodByName('__delete__accessTokens', false);
    // OpenframeUser.disableRemoteMethodByName('__destroyById__accessTokens', false);
    // OpenframeUser.disableRemoteMethodByName('__findById__accessTokens', false);
    // OpenframeUser.disableRemoteMethodByName('__get__accessTokens', false);
    // OpenframeUser.disableRemoteMethodByName('__updateById__accessTokens', false);

    OpenframeUser.afterRemote('create', function(context, OpenframeUserInstance, next) {
        debug('> OpenframeUser.afterRemote triggered');

        var options = {
            type: 'email',
            to: OpenframeUserInstance.email,
            from: 'Openframe <noreply@openframe.io>',
            subject: 'Welcome to Openframe!',
            template: path.resolve(__dirname, '../../server/views/email-templates/verify.ejs'),
            redirect: OpenframeUser.app.get('webapp_url') + '/verified',
            OpenframeUser: OpenframeUser
        };

        OpenframeUserInstance.verify(options, function(err, response) {
            if (err) return next(err);

            debug('> verification email sent:', response);

            context.res.send(JSON.stringify({
                success: true
            }));
        });
    });


    OpenframeUser.on('resetPasswordRequest', function(info) {
        debug(info.email); // the email of the requested user
        debug(info.accessToken.id); // the temp access token to allow password reset
        var url = OpenframeUser.app.get('webapp_url') + '/reset-password/' + info.accessToken.id;
        var renderer = loopback.template(path.resolve(__dirname, '../../server/views/email-templates/reset-password.ejs'));
        var html_body = renderer({
            reset_link: url
        });
        OpenframeUser.app.models.Email.send({
            to: info.email,
            from: 'Openframe <noreply@openframe.io>',
            subject: 'Openframe password reset',
            html: html_body
        }, function(err) {
            if (err) return debug('> error sending password reset email');
            debug('> sending password reset email to:', info.email);
        });
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
        self.owned_frames({
            include: [
                'managers',
                'current_artwork',
                'owner'
                // {
                //     relation: 'owner', // include the owner object
                //     scope: { // further filter the owner object
                //         fields: ['username', 'email', 'id']
                //     }
                // }
            ]
        }, function(err, _ownFrames) {
            var ownFrames = _ownFrames || [];
            self.managed_frames({
                include: ['managers', 'current_artwork', 'owner'],
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
    // OpenframeUser.prototype.toJSON = function() {
    //     // TODO: this seems awfully fragile... not very clear when context is available
    //     var ctx = loopback.getCurrentContext(),
    //         user = ctx.get('currentUser'),
    //         userId = user && user.id,
    //         obj = this.toObject(false, true, false);

    //     debug('USER toJSON', userId, obj);
    //     // if this isn't the currently logged in user, don't display email address
    //     if (!userId || this.id.toString() !== userId.toString()) {
    //         delete obj.email;
    //         delete obj.settings;
    //     }

    //     return obj;
    // };
};
