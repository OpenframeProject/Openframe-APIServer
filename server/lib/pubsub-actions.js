module.exports = (function() {
    var _self = {},
        _pubsub,
        // store references to the individual subscriptions
        _subscriptions = {};

    _self.wireActions = function(app) {
        _pubsub = app.pubsub;

        // listen for all /frame/updated events
        _pubsub.subscribe('/frame/updated/*', function(data) {
            console.log('frame updated.', data);
        });

        // listen for all /frame/connected events
        _pubsub.subscribe('/frame/connected', function(frame_id) {
            // update frame status
            console.log('frame %s connected', frame_id);
            app.models.Frame.findById(frame_id, function(err, frame) {
                if (err) {
                    console.log(err);
                    return;
                }
                frame.connected = true;
                frame.save();
            });
        });

        // listen for all /frame/disconnected events
        _pubsub.subscribe('/frame/disconnected', function(frame_id) {
            console.log('frame %s disconnected', frame_id);
        });
    };

    return _self;

})();