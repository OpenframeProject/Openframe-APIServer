var loopback = require('loopback'),
    boot = require('loopback-boot'),
    flash = require('express-flash'),
    bodyParser = require('body-parser'),
    path = require('path'),
    debug = require('debug')('openframe:apiserver'),
    providers = require('./providers.json'),

    // EXPORT THE APP
    app = module.exports = loopback();



// Create an instance of PassportConfigurator with the app instance
// var PassportConfigurator = require('loopback-component-passport').PassportConfigurator;
// var passportConfigurator = new PassportConfigurator(app);


// Set some app configuration
app.set('view engine', 'ejs'); // LoopBack comes with EJS out-of-box
app.set('json spaces', 2); // format json responses for easier viewing
app.set('views', path.resolve(__dirname, 'views'));

// var oneMonthInMillis = 2592000000;
// app.set('session_duration', oneMonthInMillis);

// Use express flash for session-based flash messages (used by passport)
// app.use(flash());

app.use(loopback.token({
    cookies: ['access_token'],
    headers: ['access_token'],
    params: ['access_token'],
    currentUserLiteral: 'current'
}));

app.use(loopback.context());

app.use(function(req, res, next) {
    if (!req.accessToken) return next();
    // console.log('accessToken present', req.accessToken);
    app.models.OpenframeUser.findById(req.accessToken.userId, function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('No user with this access token was found.'));
        var loopbackContext = loopback.getCurrentContext();
        // console.log('loopbackContext', loopbackContext);
        if (loopbackContext) {
            console.log('setting user on context', user);
            loopbackContext.set('currentUser', user);
        }
        next();
    });
});

// boot scripts mount components like REST API
boot(app, __dirname);

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
    extended: true
}));

// The access token is only available after boot
app.middleware('auth', loopback.token({
    model: app.models.AccessToken
}));

// app.middleware('session:before', loopback.cookieParser(app.get('cookieSecret')));
// app.middleware('session', loopback.session({
//     secret: app.get('cookieSecret'),
//     saveUninitialized: true,
//     resave: true
// }));

// passportConfigurator.init();

// // Set up related models for Passport
// passportConfigurator.setupModels({
//     userModel: app.models.OpenframeUser,
//     userIdentityModel: app.models.OpenframeUserIdentity,
//     userCredentialModel: app.models.OpenframeUserCredential
// });

// Configure passport strategies for third party auth providers
// for (var s in providers) {
//     var c = providers[s];
//     c.session = c.session !== false;
//     passportConfigurator.configureProvider(s, c);
// }

// Set static file dirs here, NOT in middleware.json...
// that doesn't work in this case (not sure why)
app.use(loopback.static(path.resolve(__dirname, '../client')));
app.use(loopback.static(path.resolve(__dirname, '../node_modules')));

// // Requests that get this far won't be handled
// // by any middleware. Convert them into a 404 error
// // that will be handled later down the chain.
// app.use(loopback.urlNotFound());

// Catch LOGIN_FAILED error (bug in loopback-component-passport
// see https://github.com/strongloop/loopback-component-passport/pull/112)
app.use(function(err, req, res, next) {
    debug(err.code);
    if (err.code === 'LOGIN_FAILED') {
        req.flash('error', 'Login failed.');
        return res.redirect('back');
    }
    next(err);
});

app.start = function() {
    // start the web server
    return app.listen(function() {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        debug('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            debug('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// start the server if `$ node server.js`
if (require.main === module) {
    app.start();
}
