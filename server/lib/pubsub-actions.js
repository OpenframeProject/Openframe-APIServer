module.exports = (function() {
    var _self = {},
        _pubsub,
        // store references to the individual subscriptions
        _subscriptions = {};

    _self.wireActions = function(pubsub) {
        _pubsub = pubsub;

        // listen for all /frame/updated events
        _pubsub.subscribe('/frame/updated/*', function(data) {
            console.log('frame updated.', data);
        });

        // listen for all /frame/connected events
        _pubsub.subscribe('/frame/connected', function(frame_id) {
            console.log('frame %s connected', frame_id);
        });

        // listen for all /frame/disconnected events
        _pubsub.subscribe('/frame/disconnected', function(frame_id) {
            console.log('frame %s disconnected', frame_id);
        });
    };

    return _self;

})();