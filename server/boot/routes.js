var debug = require('debug')('openframe:apiserver:routes'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    auth = require('../lib/auth');

module.exports = function(app) {

    // add path to response locals
    // app.use(function(req, res, next) {
    //     res.locals.path = req.path;
    //     res.locals.ps_url = app.get('ps_url');
    //     res.locals.access_token = req.accessToken ? req.accessToken.id : '';
    //     next();
    // });

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

};

