var p = require('../package.json');
var version = p.version.split('.').shift();
module.exports = {
  restApiRoot: '/api' + (version > 0 ? '/v' + version : ''),
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8888,
  "remoting": {
    "context": {
      "enableHttpContext": true
    },
    "rest": {
      "normalizeHttpPath": false,
      "xml": false
    },
    "json": {
      "strict": false,
      "limit": "100kb"
    },
    "urlencoded": {
      "extended": true,
      "limit": "100kb"
    },
    "cors": false,
    "errorHandler": {
      "disableStackTrace": false
    }
  },
  "pubsub_protocol": process.env.PS_PROTOCOL || "http",
  "pubsub_host": process.env.PS_HOST || "localhost",
  "pubsub_port": process.env.PS_PORT || 8889,
  "pubsub_path": process.env.PS_PATH || "/faye",
  "cookieSecret": process.env.COOKIE_SECRECT || "cce6829c-328e-4e38-aa5c-f4714ac93914",
  "legacyExplorer": false
};