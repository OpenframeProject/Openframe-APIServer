# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary server in each group
# is considered to be the first unless any hosts have the primary
# property set.  Don't declare `role :all`, it's a meta role.

# role :app, %w{23.21.86.131}
# role :web, %w{23.21.86.131}
# role :db,  %w{23.21.86.131}


# Extended Server Syntax
# ======================
# This can be used to drop a more detailed server definition into the
# server list. The second argument is a, or duck-types, Hash and is
# used to set extended properties on the server.

set :user, 'web'

server 'staging.revisit.global', user: fetch(:user), roles: %w{web app}

# PATHS
set :deploy_to, "/var/www/staging.revisit.global/api"
set :log_path, "/var/log/#{fetch:application}/staging.revisit.global-debug.log"

set :linked_files, %w{config/db/staging_config.js}
# set :forever_log_path, "/var/log/#{fetch:application}/staging.revisit.global-forever.log"

# We can use environment vars to specify a revision or branch to deploy to staging.
# Defaults to 'master' branch.
#
# Examples:
# 
# REVISION=8b42a3e cap production deploy
# BRANCH=some_test_branch cap staging deploy
#
set :branch, ENV["REVISION"] || ENV["BRANCH"] || "master"

# For staging, we DO want devDependencies included, at least for now.
# set :npm_flags, '--production --silent'
set :npm_flags, '--silent'

# Custom SSH Options
# ==================
# You may pass any option but keep in mind that net/ssh understands a
# limited set of options, consult[net/ssh documentation](http://net-ssh.github.io/net-ssh/classes/Net/SSH.html#method-c-start).
#
# Global options
# --------------
#  set :ssh_options, {
#    keys: %w(/home/rlisowski/.ssh/id_rsa),
#    forward_agent: false,
#    auth_methods: %w(password)
#  }
#
# And/or per server (overrides global)
# ------------------------------------
# server 'example.com',
#   user: 'user_name',
#   roles: %w{web app},
#   ssh_options: {
#     user: 'user_name', # overrides user setting above
#     keys: %w(/home/user_name/.ssh/id_rsa),
#     forward_agent: false,
#     auth_methods: %w(publickey password)
#     # password: 'please use keys'
#   }
