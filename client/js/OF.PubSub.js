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
        var frames = OF.Frames.getFramesList();
        frames.forEach(function(frame) {
            console.log(frame.id);
            _client.subscribe('/frame/' + frame.id + '/connected', function(data) {
                console.log('frame connected!', data);

            });
            _client.subscribe('/frame/' + frame.id + '/disconnected', function(data) {
                console.log('frame disconnected!', data);
            });
            _client.subscribe('/frame/' + frame.id + '/updated', function(data) {
                console.log('frame updated!', data);
                $('.btn-pushing').removeClass('btn-pushing').addClass('btn-displaying');
            });
            _client.subscribe('/frame/' + frame.id + '/updating', function(data) {
                console.log('frame updating!', data);
            });
        });
    }

    return {
        client: _client,
        init: init
    };
})(OF);
