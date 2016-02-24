module.exports = function enableAuthentication(app) {
    // enable authentication
    app.enableAuth();

    // Pure ugliness
    //
    // Because the API's token-based auth doesn't automatically sync up with passport,
    // if a user logs in via the API we need to manually handle the passport (i.e. session / cookie)
    // login stuff.
    app.models.OpenframeUser.afterRemote('login', function(ctx, accessToken, next) {
        var res = ctx.res,
            req = ctx.req;

        if (accessToken !== null) {
            if (accessToken.id !== null) {
                app.models.OpenframeUser.findById(accessToken.userId, function(err, user) {
                    if (err) {
                        return next();
                    }
                    req.login(user, function(err) {
                        res.cookie('access_token', accessToken.id, {
                            signed: req.signedCookies ? true : false,
                            maxAge: 1000 * accessToken.ttl
                        });
                        res.cookie('userId', accessToken.userId.toString(), {
                            signed: req.signedCookies ? true : false,
                            maxAge: 1000 * accessToken.ttl
                        });
                        return next();
                    });
                });
            }
        } else {
            return next();
        }
    });

    app.models.OpenframeUser.afterRemote('logout', function(ctx, result, next) {
        var res = ctx.res;
        res.clearCookie('access_token');
        res.clearCookie('userId');
        return next();
    });
};

