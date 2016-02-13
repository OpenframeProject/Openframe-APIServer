var debug = require('debug')('routes'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    loopback = require('loopback'),
    flash = require('express-flash'),
    auth = require('../lib/auth');

module.exports = function(app) {
    var router = app.loopback.Router();

    // this needs to be here in order to show flash messages from passport
    router.use(flash());

    // add accessToken to user
    // router.use(function(req, res, next) {
    //     // user added to req by passport deserialize function, if logged in.
    //     var user = req.user;
    //     if (user) {
    //         user.accessTokens(function(err, tokens) {
    //             // attach the first token to the user for rendering
    //             user.accessToken = tokens && tokens.length ? tokens[0].id : null;
    //             next();
    //         });
    //     } else {
    //         next();
    //     }
    // });

    router.get('/', ensureLoggedIn('/login'), function(req, res, next) {
        var user = req.user;
        return res.redirect('/' + user.username);
    });

    // Render login page
    router.get('/login', function(req, res, next) {
        return res.render('login');
    });

    /**
     * Login success route
     *
     * Sets access_token and userId cookies then redirects to user profile.
     */
    router.get('/login-success', ensureLoggedIn('/login'), function(req, res, next) {
        var user = req.user;
        user.accessTokens(function(err, tokens) {
            // use the first access token
            token = tokens && tokens.length ? tokens[0] : null;
            if (token !== null) {
                if (token.id !== null) {
                    res.cookie('access_token', token.id, {
                        signed: req.signedCookies ? true : false,
                        maxAge: 1000 * token.ttl
                    });
                    res.cookie('userId', token.userId.toString(), {
                        signed: req.signedCookies ? true : false,
                        maxAge: 1000 * token.ttl
                    });
                }
            }
            res.redirect('/' + user.username);
        });
    });

    // Render create account page
    router.get('/logout', function(req, res, next) {
        req.logout();
        res.clearCookie('access_token');
        res.clearCookie('userId');
        res.redirect('/');
    });

    // Render create account page
    router.get('/create-account', function(req, res, next) {
        return res.render('create-account');
    });

    // Create account form handler
    router.post('/create-account', function(req, res, next) {

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

        OpenframeUser.create(newUser, function(err, user) {
            if (err) {
                // TODO: better user-facing error messages...
                req.flash('error', err.message);
                return res.redirect('back');
            } else {
                // new user... create default collection
                Collection.create({ownerId: user.id}, function(err, collection) {
                    if (err) {
                        console.log(err);
                    }
                    // Passport exposes a login() function on req (also aliased as logIn())
                    // that can be used to establish a login session. This function is
                    // primarily used when users sign up, during which req.login() can
                    // be invoked to log in the newly registered user.
                    req.login(user, function(err) {
                        if (err) {
                            req.flash('error', err.message);
                            return res.redirect('back');
                        }
                        return res.redirect('/login-success');
                    });
                });

            }
        });
    });

    // Render add artwork page
    router.get('/add-artwork', ensureLoggedIn('/login'), function(req, res, next) {
        var user = req.user;

        return res.render('add-artwork', {
            user: user
        });
    });

      // Create an account form handler
    router.post('/add-artwork', ensureLoggedIn('/login'), function(req, res, next) {
        var user = req.user,
            newArtwork = {};

        // TODO: validation

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

            if (collections.length < 1) {

            }

            // TODO: once we support multiple collections, select
            // which collection to add to... for now, add to first
            collections[0].artwork.create(newArtwork, function(err, artwork) {
                if (err) {
                    // TODO: better user-facing error messages...
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                return res.redirect('/'+user.username);
            });
        });

        // user.owned_artwork.create(newArtwork, function(err, artwork) {
        //     if (err) {
        //         // TODO: better user-facing error messages...
        //         req.flash('error', err.message);
        //         return res.redirect('back');
        //     } else {
        //         // artwork successfully, add it to collection
        //         // TODO: once we support multiple collections, select
        //         // which collection to add to... for now, add to first
        //         user.collections(function(err, collections) {
        //             collections.
        //         });
        //         return res.redirect('/'+user.username);
        //     }
        // });
    });



    // TODO: Implement these...

    //show password reset form
    app.get('/reset-password', function(req, res, next) {
        if (!req.accessToken) return res.sendStatus(401);
        res.render('password-reset', {
            accessToken: req.accessToken.id
        });
    });

    //reset the user's pasword
    app.post('/reset-password', function(req, res, next) {
        if (!req.accessToken) return res.sendStatus(401);

        //verify passwords match
        if (!req.body.password ||
            !req.body.confirmation ||
            req.body.password !== req.body.confirmation) {
            return res.sendStatus(400, new Error('Passwords do not match'));
        }

        User.findById(req.accessToken.userId, function(err, user) {
            if (err) return res.sendStatus(404);
            user.updateAttribute('password', req.body.password, function(err, user) {
                if (err) return res.sendStatus(404);
                console.log('> password reset processed successfully');
                res.render('response', {
                    title: 'Password reset success',
                    content: 'Your password has been reset successfully',
                    redirectTo: '/',
                    redirectToLinkText: 'Log in'
                });
            });
        });
    });




    // PROFILE route
    // This route is last -- this way we can use the old /username thing
    router.get('/:username', ensureLoggedIn('/login'), function(req, res, next) {
        var user = req.user;

        // For the moment, only let people view their own profile
        if (req.params.username !== user.username) {
            return res.redirect('/' + user.username);
        }

        return res.render('profile', {
            user: user
        });

    });

    app.use(router);
};

