'use strict';

var loopback = require('loopback'),
    boot = require('loopback-boot'),
    bodyParser = require('body-parser'),
    path = require('path'),
    config = require('./providers.json'),
    /**
     * Flash messages for passport
     *
     * Setting the failureFlash option to true instructs Passport to flash an
     * error message using the message given by the strategy's verify callback,
     * if any. This is often the best approach, because the verify callback
     * can make the most accurate determination of why authentication failed.
     */
    flash = require('express-flash'),

    // EXPORT THE APP
    app = module.exports = loopback();


// Create an instance of PassportConfigurator with the app instance
var PassportConfigurator = require('loopback-component-passport').PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);


// Set some app configuration
app.set('view engine', 'ejs'); // LoopBack comes with EJS out-of-box
app.set('json spaces', 2); // format json responses for easier viewing
app.set('views', path.resolve(__dirname, 'views'));

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

app.middleware('session:before', loopback.cookieParser(app.get('cookieSecret')));
app.middleware('session', loopback.session({
  secret: app.get('cookieSecret'),
  saveUninitialized: true,
  resave: true
}));
passportConfigurator.init();

// We need flash messages to see passport errors
app.use(flash());
// app.locals.messages = null;
// Set up related models
passportConfigurator.setupModels({
    userModel: app.models.OpenframeUser,
    userIdentityModel: app.models.OpenframeUserIdentity,
    userCredentialModel: app.models.OpenframeUserCredential
});

// Configure passport strategies for third party auth providers
for (var s in config) {
    var c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
}

// Set static file dirs here, NOT in middleware.json... that doesn't work in this case (not sure why)
app.use(loopback.static(path.resolve(__dirname, '../client')));
app.use(loopback.static(path.resolve(__dirname, '../node_modules')));

// // Requests that get this far won't be handled
// // by any middleware. Convert them into a 404 error
// // that will be handled later down the chain.
app.use(loopback.urlNotFound());

// // The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function() {
    // start the web server
    return app.listen(function() {
        app.emit('started');
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}