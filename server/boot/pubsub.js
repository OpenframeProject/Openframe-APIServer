var faye = require('faye'),
    ps_actions = require('../lib/pubsub-actions');

// Note: the 'app' arg is called 'app' elsewhere in loopback
module.exports = function(app) {
    console.log('instantiating pubsub module');

    var ps_protocol = app.get('pubsub_protocol'),
        ps_host = app.get('pubsub_host'),
        ps_port = app.get('pubsub_port'),
        ps_path = app.get('pubsub_path'),
        ps_url = ps_protocol + '://' + ps_host + ':' + ps_port + ps_path;

    console.log(ps_url);

    // Once the loopback app has started, start up the faye app
    app.on('started', function() {
        // add a pubsub client for the API app
        app.pubsub = new faye.Client(ps_url);

        // handlers for pubsub connection events
        app.pubsub.on('transport:down', function() {
            // the pubsub client is offline
            console.log('pubsub client offline');
        });

        app.pubsub.on('transport:up', function() {
            // the pubsub client is online
            console.log('pubsub client online');
        });

        // app.pubsub.subscribe('/openframe-gpio/17', function(data) {
        //     // the pubsub client is online
        //     console.log('GPIO', data);
        // });

        // wire up default pubsub actions
        ps_actions.wireActions(app);
    });
};

