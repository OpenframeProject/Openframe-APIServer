var faye = require('faye'),
    debug = require('debug')('openframe:apiserver:webapp');

// Note: the 'app' arg is called 'app' elsewhere in loopback
module.exports = function(app) {
    debug('instantiating webapp bootstrapping');

    var webapp_protocol = app.get('webapp_protocol'),
        webapp_host = app.get('webapp_host'),
        webapp_port = app.get('webapp_port'),
        webapp_url = webapp_protocol + '://' + webapp_host + (webapp_port ? ':' + webapp_port : '');

    app.set('webapp_base_url', webapp_url);
};
