var debug = require('debug')('routes'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    flash = require('express-flash');

module.exports = function(app) {
    var router = app.loopback.Router();

    // this needs to be here in order to show flash messages from passport
    router.use(flash());

    router.get('/user/:username', ensureLoggedIn('/login'), function(req, res, next) {
        var username = req.params.username;
        res.send(username);
    });

    router.get('/', ensureLoggedIn('/login'), function(req, res, next) {
        debug('/index');
        return res.render('profile');
    });

    // Render login page
    router.get('/login', function(req, res, next) {
        return res.render('login');
    });

    // Render create account page
    router.get('/create-account', function(req, res, next) {
        return res.render('create-account');
    });




    router.post('/signup', function(req, res, next) {

        var OpenframeUser = app.models.OpenframeUser,
            newUser = {};

        if (req.body.password !== req.body.password_confirm) {
            req.flash('error', 'Password fields do not match.');
            return res.redirect('back');
        }

        newUser.email = req.body.email.toLowerCase();
        newUser.username = req.body.username.trim();
        newUser.password = req.body.password;

        OpenframeUser.create(newUser, function(err, user) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            } else {
                // Passport exposes a login() function on req (also aliased as logIn())
                // that can be used to establish a login session. This function is
                // primarily used when users sign up, during which req.login() can
                // be invoked to log in the newly registered user.
                req.login(user, function(err) {
                    if (err) {
                        req.flash('error', err.message);
                        return res.redirect('back');
                    }
                    return res.redirect('/auth/account');
                });
            }
        });
    });

    app.use(router);
};

