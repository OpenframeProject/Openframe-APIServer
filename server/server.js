/*
Openframe-APIServer is the server component of Openframe, a platform for displaying digital art.
Copyright (C) 2017  Jonathan Wohl

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var loopback = require('loopback'),
    boot = require('loopback-boot'),
    bodyParser = require('body-parser'),
    path = require('path'),
    debug = require('debug')('openframe:apiserver'),

    // EXPORT THE APP
    app = module.exports = loopback();

// Set some app configuration
app.set('view engine', 'ejs'); // LoopBack comes with EJS out-of-box
app.set('json spaces', 2); // format json responses for easier viewing
app.set('views', path.resolve(__dirname, 'views'));

app.use(loopback.token({
    cookies: ['access_token'],
    headers: ['access_token'],
    params: ['access_token'],
    currentUserLiteral: 'current'
}));

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

app.use(loopback.static(path.resolve(__dirname, '../client')));

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
