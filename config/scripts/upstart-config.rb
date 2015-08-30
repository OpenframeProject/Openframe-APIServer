set :upstart_file_contents, lambda {
<<EOD
#!upstart
description #{fetch(:application)}
author      "Sustainable Engineering Lab - Columbia University"

start on started network
stop on stopping network

respawn
respawn limit 20 10

# if using daemon module
expect daemon

# if using forever
# expect fork

# set node environment and user
env NODE_ENV=#{fetch:stage}
setuid #{fetch:user}

script

    # using forever
    # exec forever start -l #{fetch(:log_path)} #{fetch(:deploy_to)}/current/bin/#{fetch(:server_init_file)}
    
    # using daemon
    exec #{fetch(:deploy_to)}/current/bin/#{fetch(:server_init_file)} >> #{fetch(:log_path)} 2>&1
end script

pre-start script

    echo "[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Starting" >> #{fetch(:log_path)}
end script

pre-stop script

    echo "[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Stopping" >> #{fetch(:log_path)}

    # using forever, we need to stop the server here
    # exec forever stop #{fetch(:deploy_to)}/current/bin/#{fetch(:server_init_file)}
end script
EOD
}