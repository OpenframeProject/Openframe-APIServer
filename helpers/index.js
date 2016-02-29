var debug = require('debug')('openframe:helpers'),
    loopback = require('loopback');

module.exports = {
    addLikedToReq: function(ctx, something, next) {
        debug('something', something);

        var context = loopback.getCurrentContext(),
            req = context && context.active ? context.active.http.req : null,
            user = req ? req.user : null;

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
