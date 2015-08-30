/**
 * This file defines the settings used on the testing environment.
 *
 * The defaults are pulled in and combined with the env specific settings -- only the necessary settings
 * should be overridden here.
 */

console.log('LOADING TESTING CONFIG');

var _ = require('lodash-node'),
	def_config = require('./default_config');

var config = {};

config.prePath = '/api/testing';
config.host = 'localhost';
config.port = '1337';
config.db_loc = config.host + '/test';

// staging serves the site on port 80 via nginx
config.site = "http://" + config.host;
config.site += config.prePath + "/" + "facilities/";

config.USE_AUTH = false;

// add default config to this env config
_.defaults(config, def_config);

module.exports = config;
