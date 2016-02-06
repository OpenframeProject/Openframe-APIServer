module.exports = function(Frame) {
    Frame.updateArtwork = function(artworkId, cb) {
        var Artwork = Frame.app.models.Artwork;
        Artwork.findById(artworkId, function(err, artwork) {
            if (err) return cb(err);

            Frame.__update__current_artwork(artwork, function(err, frame) {
                if (err) return cb(err);
                cb(null, frame);
            });
        });
    };

    Frame.remoteMethod(
        'updateArtwork', {
            'http': {
                'verb': 'put'
            },
            returns: {
                arg: 'Frame',
                type: 'object'
            }
        }
    );


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

