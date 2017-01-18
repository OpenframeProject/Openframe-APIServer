var debug = require('debug')('openframe:helpers'),
    loopbackCtx = require('loopback-context'),
    loopback = require('loopback');

module.exports = {
    addLikedToReq: function(ctx, something, next) {
        debug('something', something);

        var context = loopbackCtx.getCurrentContext(),
            user = ctx && ctx.get('currentUser');

        if (user) {
            user.liked_artwork({fields: {id: true}}, function(err, artwork) {
                if (artwork) {
                    req.liked_artwork = artwork.map(function(art) {
                        return art.id.toString();
                    });
                }
                next();
            });
        } else {
            next();
        }
    }
};
