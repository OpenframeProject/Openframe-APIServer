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
  "pubsub_protocol": "http",
  "pubsub_host": "0.0.0.0",
  "pubsub_port": 8889,
  "pubsub_path": "/faye",
  "cookieSecret": "246bace2-38cb-4138-85d9-0ae8160b07c8",
  "legacyExplorer": false
};