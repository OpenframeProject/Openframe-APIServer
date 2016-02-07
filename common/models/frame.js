module.exports = function(Frame) {
    Frame.observe('after save', function(ctx, next) {
        if (ctx.instance) {
            console.log('Saved %s#%s', ctx.Model.modelName, ctx.instance.id);
            if (Frame.app.pubsub) {
                Frame.app.pubsub.publish('/frame/updated/' + ctx.instance.id, ctx.instance);
            }
        } else {
            console.log('Updated %s matching %j',
                ctx.Model.pluralModelName,
                ctx.where);
        }
        next();
    });
};

