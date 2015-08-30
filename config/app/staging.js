/**
 * This file defines the settings used on the staging environment.
 *
 * The defaults are pulled in and combined with the env specific settings -- only the necessary settings
 * should be overridden here.
 */

console.log('LOADING STAGING CONFIG');

var _ = require('lodash-node'),
	def_config = require('./default_config');

var config = {};

config.prePath = '/api/v0';
config.host = 'staging.revisit.global';
config.port = '3000';

// staging serves the site on port 80 via nginx
config.site = "http://" + config.host;
config.site += config.prePath + "/" + "facilities/";

config.USE_AUTH = true;

config.log_root = '/var/log/' + def_config.app_name + '/';

// add default config to this env config
_.defaults(config, def_config);

module.exports = config;