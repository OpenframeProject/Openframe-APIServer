/**
 * This file defines the default settings used on local development environments.
 */

var config = {};

// set defaults -- these will be overriden by duplicate settings in env_config
config.app_name = "openframe-api";
config.version = '0.1.0';

config.USE_AUTH = false;
config.ALLOW_GET = true;
config.ALLOW_POST = false;
config.ALLOW_PUT = false;
config.BLOCK_USERS = true;

config.prePath = '/api/v0';
config.host = "localhost";
config.port = '3000';

config.site = "http://" + config.host;
config.site += config.port ? ":" + config.port : '';

config.log_root = __dirname + '/../../log/';

if (config.ALLOW_POST || config.ALLOW_PUT) {
    config.ALLOW_GET = true; // enforce get if put/post
}

/**
 * Combo getter/setters for auth
 *
 * TODO: this should be moved to an authorization module
 */

config.useAuth = function(use) {
	if (typeof use === "boolean") {
		config.USE_AUTH = use;
	}
	return config.USE_AUTH;
};

config.allowGet = function(allow) {
	if (typeof allow === "boolean") {
		config.ALLOW_GET = allow;
	}
	return config.ALLOW_GET;
};

config.allowPut = function(allow) {
	if (typeof allow === "boolean") {
		config.ALLOW_PUT = allow;
	}
	return config.ALLOW_PUT;
};

config.allowPost = function(allow) {
	if (typeof allow === "boolean") {
		config.ALLOW_POST = allow;
	}
	return config.ALLOW_POST;
};

config.blockUsers = function(allow) {
	if (typeof allow === "boolean") {
		config.BLOCK_USERS = allow;
	}
	return config.BLOCK_USERS;
};
// export combined configuration for this environment
module.exports = config;
