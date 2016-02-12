module.exports = function enableAuthentication(app) {
    // enable authentication
    app.enableAuth();

    // For current auth method, this is not necessary:

    // app.models.OpenframeUser.afterRemote('login', function(context, accessToken, next) {
    //     var res = context.res;
    //     var req = context.req;

    //     console.log('user!', res.user);

    //     if (accessToken != null) {
    //         if (accessToken.id != null) {
    //             res.cookie('access_token', accessToken.id, {
    //                 signed: req.signedCookies ? true : false,
    //                 maxAge: 1000 * accessToken.ttl
    //             });
    //             res.cookie('userId', accessToken.userId.toString(), {
    //                 signed: req.signedCookies ? true : false,
    //                 maxAge: 1000 * accessToken.ttl
    //             });
    //         }
    //     }
    //     return next();
    // });

    // app.models.OpenframeUser.afterRemote('logout', function(context, result, next) {
    //     var res = context.result;
    //     res.clearCookie('access_token');
    //     res.clearCookie('userId');
    //     return next();
    // });

};

