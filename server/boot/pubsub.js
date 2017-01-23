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

var faye = require('faye'),
    debug = require('debug')('openframe:apiserver:pubsub');

module.exports = function(app) {
    debug('instantiating pubsub module');

    var ps_url = app.get('pubsub_url'),
        ps_token = app.get('pubsub_api_token'),
        clientAuth = {
            outgoing: function(message, callback) {
                debug(message);
                // leave non-subscribe messages alone
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
