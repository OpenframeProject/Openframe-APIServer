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

var p = require('../package.json'),
    version = p.version.split('.').shift();
module.exports = {
    restApiRoot: '/v' + version,
    host: process.env.API_HOST || '0.0.0.0',
    port: process.env.API_PORT || 8888,
    'remoting': {
        'rest': {
            'normalizeHttpPath': false,
            'xml': false
        },
        'json': {
            'strict': false,
            'limit': '100kb'
        },
        'urlencoded': {
            'extended': true,
            'limit': '100kb'
        },
        'cors': false,
        'errorHandler': {
            'disableStackTrace': false
        }
    },
    'webapp_url': process.env.WEBAPP_EXPOSED_URL || null,
    'pubsub_url': process.env.PS_EXPOSED_URL || 'http://0.0.0.0:8889/faye',
    'pubsub_api_token': process.env.PS_API_TOKEN || '8629c101-4db7-4a0a-9bf1-33c5fc3cff23',
    'cookieSecret': process.env.COOKIE_SECRECT || 'cce6829c-328e-4e38-aa5c-f4714ac93914',
    'legacyExplorer': false
};
