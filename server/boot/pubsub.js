var faye = require('faye'),
    PubsubActions = require('../PubsubActions');

// TODO: add pubsub server settings to config

// Note: the 'server' arg is called 'app' elsewhere in loopback
module.exports = function(server) {
    console.log('instantiating pubsub module');

    // Once the loopback app has started, start up the faye server
    server.on('started', function() {
        // add a pubsub client for the API server
        server.pubsub = new faye.Client('http://localhost:8889/faye');

        // handlers for pubsub connection events
        server.pubsub.on('transport:down', function() {
            // the pubsub client is offline
            console.log('pubsub client offline');
        });

        server.pubsub.on('transport:up', function() {
            // the pubsub client is online
            console.log('pubsub client online');
        });

        server.pubsub.subscribe('/openframe-gpio/17', function(data) {
            // the pubsub client is online
            console.log('GPIO', data);
        });

        // wire up default pubsub actions
        PubsubActions.wireActions(server.pubsub);
    });
};

