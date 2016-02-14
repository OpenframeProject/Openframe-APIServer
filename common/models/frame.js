var debug = require('debug')('Frame');

module.exports = function(Frame) {
    Frame.disableRemoteMethod('createChangeStream', true);

    // whenever a Frame model is saved, broadcast an update event
    Frame.observe('after save', function(ctx, next) {
        if (ctx.instance) {
            debug('Saved %s#%s', ctx.Model.modelName, ctx.instance.id);
            if (Frame.app.pubsub) {
                Frame.app.pubsub.publish('/frame/' + ctx.instance.id + '/updated', ctx.instance);
            }
        }
        next();
    });
};

