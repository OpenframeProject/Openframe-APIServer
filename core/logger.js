// local includes
var bunyan = require('bunyan'),
    conf = require('../config/app/config');

console.log(conf);

// logger 
function init() {
    var log = bunyan.createLogger({
        name: conf.app_name,
        streams: [
            {
                level: 'info',
                stream: null,
                type: 'rotating-file',
                path: conf.log_root + conf.app_name + '-access.log',
                period: '1d',   // daily rotation
                count: 7        // keep 7 back copies
            },
            {
                level: 'error',
                path: conf.log_root + conf.app_name + '-error.log'  // log ERROR and above to a file
            },
            {
                level: 'debug',
                stream: process.stdout
            }
        ]
    });
    return log;
}

// note node.js caches required files. Init will be called once.
exports.log = init();
