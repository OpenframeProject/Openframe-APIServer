var faye = require('faye'),
    debug = require('debug')('openframe:apiserver:pubsub');

// Note: the 'app' arg is called 'app' elsewhere in loopback
module.exports = function(app) {
    debug('instantiating pubsub module');

    var ps_protocol = app.get('pubsub_protocol'),
        ps_host = app.get('pubsub_host'),
        ps_port = app.get('pubsub_port'),
        ps_path = app.get('pubsub_path'),
        ps_token = app.get('pubsub_token'),
        ps_url = ps_protocol + '://' + ps_host + ':' + ps_port + ps_path,
        clientAuth = {
            outgoing: function(message, callback) {
                // Again, leave non-subscribe messages alone
                if (message.channel !== '/meta/subscribe') {
                    return callback(message);
                }

                // Add ext field if it's not present
                if (!message.ext) {
                    message.ext = {};
                }

                // Set the auth token
                message.ext.accessToken = ps_token;

                // Carry on and send the message to the server
                callback(message);
            }
        };

    app.set('ps_url', ps_url);

    // Once the loopback app has started, connect to the PubSub server
    app.on('started', function() {
        // add a pubsub client for the API app
        app.pubsub = new faye.Client(ps_url);

        app.pubsub.addExtension(clientAuth);

        // handlers for pubsub connection events
        app.pubsub.on('transport:down', function() {
            // the pubsub client is offline
            debug('pubsub client offline');
        });

        // handlers for pubsub connection events
        app.pubsub.on('transport:up', function() {
            // the pubsub client is online
            debug('pubsub client online');
        });

        // listen for all /frame/connected events, update the Frame
        app.pubsub.subscribe('/frame/connected', function(frame_id) {
            // update frame status
            debug('frame %s connected', frame_id);
            app.models.Frame.findById(frame_id, function(err, frame) {
                if (err) {
                    debug(err);
                    return;
                }
                if (frame === null) {
                    debug('Unknown frame connected.');
                    return;
                }
                frame.connected = true;
                frame.save();
            });
        });

        // listen for all /frame/disconnected events, update the Frame
        app.pubsub.subscribe('/frame/disconnected', function(frame_id) {
            debug('frame %s disconnected', frame_id);
            // update frame status
            app.models.Frame.findById(frame_id, function(err, frame) {
                if (err) {
                    debug(err);
                    return;
                }
                if (frame === null) {
                    debug('Unknown frame disconnected.');
                    return;
                }
                frame.connected = false;
                frame.save();
            });
        });
    });
};
