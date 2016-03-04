window.PubSub = (function() {
    var client = new Faye.Client(window.PS_URL, {
            timeout: 5,
            retry: 5
        }),
        clientAuth = {
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
    // client.disable('websocket');
    client.addExtension(clientAuth);

    return client;
})();
