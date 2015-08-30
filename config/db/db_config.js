	// an environment variable specifying the environment
var env = process.env.NODE_ENV,
	
	// if we have an environment specified, pull in its config
	db_config = env ? require(__dirname + '/'+env+'_config') : require(__dirname + '/default_config');

// export configuration for this environment
module.exports = db_config;