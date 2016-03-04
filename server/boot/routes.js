var debug = require('debug')('openframe:apiserver:routes'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    auth = require('../lib/auth');

module.exports = function(app) {

    // add path to response locals
    app.use(function(req, res, next) {
        res.locals.path = req.path;
        res.locals.ps_url = app.get('ps_url');
        res.locals.access_token = req.accessToken ? req.accessToken.id : '';
        next();
    });

    // index route redirects to user profile for the moment (requires login)
    app.get('/', function(req, res, next) {
        return res.render('splash');
    });

    // Render login page
    app.get('/login', function(req, res, next) {
        return res.render('login');
    });

    // Render login page
    app.get('/login-popup', function(req, res, next) {
        return res.render('login-popup');
    });

    /**
     * Login success handler route
     *
     * Sets access_token and userId cookies then redirects to user profile.
     */
    app.get('/login-success', ensureLoggedIn('/login'), function(req, res, next) {
        var user = req.user;
        debug(req.params);
        user.accessTokens(function(err, tokens) {
            // use the first access token
            var token = tokens && tokens.length ? tokens[0] : null;
            if (token && token.id) {
                res.cookie('access_token', token.id, {
                    signed: req.signedCookies ? true : false,
                    maxAge: 1000 * token.ttl
                });
                res.cookie('userId', token.userId.toString(), {
                    signed: req.signedCookies ? true : false,
                    maxAge: 1000 * token.ttl
                });
            }
            res.redirect('/' + user.username);
        });
    });

    // Log out route - clear cookies, redirect to login
    app.get('/logout', ensureLoggedIn('/login'), function(req, res, next) {
        var OpenframeUser = app.models.OpenframeUser;
        debug(req.accessToken);
        OpenframeUser.logout(req.accessToken.id, function(err) {
            debug(err || 'logged out');
            req.logout();
            res.clearCookie('access_token');
            res.clearCookie('userId');
            res.redirect('/login');
        });
    });

    // Render create account page
    app.get('/create-account', function(req, res, next) {
        return res.render('create-account');
    });

    // Create account form handler
    app.post('/create-account', function(req, res, next) {

        var OpenframeUser = app.models.OpenframeUser,
            Collection = app.models.Collection,
            newUser = {};

        if (req.body.password !== req.body.password_confirm) {
            req.flash('error', 'Password fields do not match.');
            return res.redirect('back');
        }

        newUser.email = req.body.email.toLowerCase();
        newUser.username = req.body.username.trim();
        newUser.password = req.body.password;

        if (auth.blacklist.indexOf(newUser.username) !== -1) {
            req.flash('error', 'Username unavailable, please try another.');
            return res.redirect('back');
        }

        // Tip of dreaded callback pyramid... sounds like loopback will be supporting Promises eventually.
        OpenframeUser.create(newUser, function(err, user) {
            if (err) {
                // TODO: better user-facing error messages...
                req.flash('error', err.message);
                return res.redirect('back');
            }

            // new user created... create default collection
            Collection.create({
                ownerId: user.id
            }, function(err, collection) {
                if (err) {
                    debug(err);
                }

                // In order to create an accessToken for the new user, we need to
                // login via loopback. Then we'll login via req.login (passport) in
                // order to create the user session.
                OpenframeUser.login({
                    email: newUser.email,
                    password: newUser.password
                }, function(err, token) {
                    if (err) {
                        debug(err);
                        req.flash('error', err.message);
                        return req.redirect('back');
                    }
                    req.login(user, function(err) {
                        if (err) {
                            req.flash('error', err.message);
                            return res.redirect('back');
                        }
                        // all successful login-ing, hit success route to set cookies.
                        return res.redirect('/login-success');
                    });

                });


            });
        });
    });

    // Render add artwork page
    // TODO: this will become a modal
    app.get('/add-artwork', ensureLoggedIn('/login'), function(req, res, next) {
        var user = req.user;

        return res.render('add-artwork', {
            user: user
        });
    });

    // Add artwork form handler route
    app.post('/add-artwork', ensureLoggedIn('/login'), function(req, res, next) {
        var user = req.user,
            newArtwork = {};

        // TODO: validation... or let the model validator handle it?

        newArtwork.author_name = req.body.author_name;
        newArtwork.title = req.body.title;
        newArtwork.format = req.body.format;
        newArtwork.url = req.body.url;
        newArtwork.thumb_url = req.body.thumb_url;
        newArtwork.ownerId = user.id;

        user.collections(function(err, collections) {
            if (err) {
                // TODO: better user-facing error messages...
                req.flash('error', err.message);
                return res.redirect('back');
            }

            // TODO: once we support multiple collections, select
            // which collection to add to... for now, add to first
            collections[0].artwork.create(newArtwork, function(err, artwork) {
                if (err) {
                    // TODO: better user-facing error messages...
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                return res.redirect('/' + user.username);
            });
        });
    });



    // TODO: Implement these...

    //show password reset form
    // app.get('/reset-password', function(req, res, next) {
    //     if (!req.accessToken) return res.sendStatus(401);
    //     res.render('password-reset', {
    //         accessToken: req.accessToken.id
    //     });
    // });

    // //reset the user's pasword
    // app.post('/reset-password', function(req, res, next) {
    //     if (!req.accessToken) return res.sendStatus(401);

    //     //verify passwords match
    //     if (!req.body.password ||
    //         !req.body.confirmation ||
    //         req.body.password !== req.body.confirmation) {
    //         return res.sendStatus(400, new Error('Passwords do not match'));
    //     }

    //     User.findById(req.accessToken.userId, function(err, user) {
    //         if (err) return res.sendStatus(404);
    //         user.updateAttribute('password', req.body.password, function(err, user) {
    //             if (err) return res.sendStatus(404);
    //             debug('> password reset processed successfully');
    //             res.render('response', {
    //                 title: 'Password reset success',
    //                 content: 'Your password has been reset successfully',
    //                 redirectTo: '/',
    //                 redirectToLinkText: 'Log in'
    //             });
    //         });
    //     });
    // });

    // Stream route
    app.get('/stream', ensureLoggedIn('/login'), function(req, res, next) {
        var user = req.user;

        // For the moment, only let people view their own profile
        // if (req.params.username !== user.username) {
        //     return res.redirect('/' + user.username);
        // }

        return res.render('stream', {
            user: user
        });

    });

    // PROFILE route (i.e. 'collection' for the moment)
    // This route is handled last -- this way we can use /[username] as the route
    app.get('/:username', ensureLoggedIn('/login'), function(req, res, next) {
        var user = req.user;

        // For the moment, only let people view their own profile
        if (req.params.username !== user.username) {
            return res.redirect('/' + user.username);
        }

        return res.render('profile', {
            user: user
        });

    });
};

