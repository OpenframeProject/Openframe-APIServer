var p = require('../package.json'),
    version = p.version.split('.').shift();
module.exports = {
    restApiRoot: '/api' + (version > 0 ? '/v' + version : ''),
    host: process.env.API_HOST || '0.0.0.0',
    port: process.env.API_PORT || 8888,
    'remoting': {
        'context': {
            'enableHttpContext': true
        },
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
