set :db_config_file_contents, lambda {
<<EOD

var config = {
	uri: 'mongodb://localhost/#{fetch(:db_name)}',
	options: {
		user: '#{fetch(:db_user)}',
		pass: '#{fetch(:db_pass)}'
	}
};

module.exports = config;

EOD
}