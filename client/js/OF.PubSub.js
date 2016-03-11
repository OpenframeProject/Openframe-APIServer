window.OF.PubSub = (function(OF) {
    var _client = new Faye.Client(window.PS_URL, {
            timeout: 60,
            retry: 10
        }),
        _clientAuth = {
            outgoing: function(message, callback) {
                // console.log('message', message, window.PS_URL);
                if (message.channel !== '/meta/subscribe' && message.channel !== '/meta/publish') {
                    return callback(message);
                }

                // Add ext field if it's not present
                if (!message.ext) {
                    message.ext = {};
                }

                // Set the auth token
                message.ext.accessToken = window.ACCESS_TOKEN;

                // Carry on and send the message to the server
                callback(message);
            }
        };
    // _client.disable('websocket');
    _client.addExtension(_clientAuth);

    function init() {
        console.log('OF.PubSub.init()');
        // setup frame-related subscriptions for initial frames
        var frames = OF.Frames.getFramesList();
        frames.forEach(function(frame) {
            OF.Frames.setupFrameSubscriptions(frame.id);
        });

        // when a new frame is added, setup frame-related subscriptions
        _client.subscribe('/user/' + window.USER_ID + '/frame/new', function(data) {
            console.log('new frame added!', data);
            // immediately add frame and make it current
            OF.DOM.updateFrames(data);
            // setup subscriptions
            OF.Frames.setupFrameSubscriptions(data);
        });

        // TODO - clear frame subscriptions when a frame is deleted? Not sure it's necessary.
    }

    return {
        client: _client,
        init: init
    };
})(OF);
