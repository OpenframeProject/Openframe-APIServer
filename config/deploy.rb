# config valid only for Capistrano 3.2.1
lock '3.2.1'


set :application, "revisit-server"
set :repo_url, 'https://github.com/SEL-Columbia/Revisit-Server.git'

set :server_init_file, 'revisit-daemon.js'

set :upstart_job_name, 'revisit'
set :upstart_conf_file_path, "/etc/init/#{fetch(:upstart_job_name)}.conf"
set :upstart_pid_file_path, "/var/run/#{fetch(:upstart_job_name)}.pid"

set :node_bin_path, '/usr/bin/node'

set :npm_roles, :web

set :local_tmp_dir, 'tmp'

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for keep_releases is 5
# set :keep_releases, 5

namespace :setup do

  desc "Check remote server settings"
  task :servercheck do
    on roles(:all) do |h|

      info " "
      info "------------------------"
      info "-- CHECK WRITE ACCESS --"
      info "------------------------"
      info " "

      info "Checking write access..."
      if test("[ -w #{fetch(:deploy_to)} ]")
        info "#{fetch(:deploy_to)} is writable on #{h}"
      else
        error "#{fetch(:deploy_to)} is not writable on #{h}"
      end

      info " "
      info "------------------------"
      info "-- CHECK DEPENDENCIES --"
      info "------------------------"
      info " "

      info "Checking if bunyan is installed globally for logging..."
      if test("bunyan --version")
        info "bunyan is available on #{h}"
      else
        error "bunyan is not available on #{h}"
      end

      info " "
      info "---------------------"
      info "-- CHECK LOG FILES --"
      info "---------------------"
      info " "

      execute :sudo, "chown -R #{fetch:user}:#{fetch:user} /var/log/#{fetch(:application)}"

      info "Checking if access log file is present..."
      if test("[ -f /var/log/#{fetch(:application)}/#{fetch(:application)}-access.log ]")
        info "Access log is present."
      else
        error "Access log not found, attempting to create it..."
        execute :sudo, "mkdir -p /var/log/#{fetch(:application)}"
        execute :sudo, "touch /var/log/#{fetch(:application)}/#{fetch(:application)}-access.log"
        execute :sudo, "chmod 662 /var/log/#{fetch(:application)}/#{fetch(:application)}-access.log"
      end

      info "Checking if error log file is present..."
      if test("[ -f /var/log/#{fetch(:application)}/#{fetch(:application)}-error.log ]")
        info "Error log is present."
      else
        error "Error log not found, attempting to create it..."
        execute :sudo, "mkdir -p /var/log/#{fetch(:application)}"
        execute :sudo, "touch /var/log/#{fetch(:application)}/#{fetch(:application)}-error.log"
        execute :sudo, "chmod 662 /var/log/#{fetch(:application)}/#{fetch(:application)}-error.log"
      end
    end
  end

  desc "Provision server"
    task :provision do
      on roles(:all) do |h|
        info " "
        info "-----------------------------"
        info "-- Provision Ubuntu Server --"
        info "-----------------------------"
        info " "

        run_locally do
          execute :tar, "-zcf config/mongo.tar.gz config/scripts/mongo"
        end

        require_relative "scripts/provision.rb"

        tmp_provision_path = "config/provision.sh"
        run_locally do
          open(tmp_provision_path, 'w') do |f|
            f.puts "#{fetch(:provision_file_contents)}" 
          end
        end

        on roles(:app) do
          # upload to the user's home folder then execute
          upload! tmp_provision_path, "/home/#{fetch:user}/provision.sh"
          execute :sudo, "chmod +x /home/#{fetch:user}/provision.sh"
          
          # upload mongo scripts
          upload! "config/mongo.tar.gz", "/home/#{fetch:user}/mongo.tar.gz"
          execute :tar, "-zxf /home/#{fetch:user}/mongo.tar.gz"

          # provision!
          execute :sudo, "/home/#{fetch:user}/provision.sh"
          
          ### cleanup remote
          execute :rm, "-rf /home/#{fetch:user}/mongo*"
          execute :rm, "/home/#{fetch:user}/provision.sh"
        end

        invoke 'setup:upstart_config'

        ### cleanup local
        run_locally do
          execute :rm, "-rf config/mongo.tar.gz"
          execute :rm, "-rf", tmp_provision_path
        end

        info " "
        info "COMPLETE"
        info " "
        info "It is recommended that you now change the database users' credentials on the server."
        info " "
        info "Once new credentials have been put in place, you'll want to generate the db config by running:"
        info " "
        info "$ cap [env] setup:db:config"
        info " "
      end
    end

  namespace :db do 
    desc "Create database settings"
    task :config do
      on roles(:app) do
        info " "
        info "------------------------------"
        info "-- CREATE DATABASE SETTINGS --"
        info "------------------------------"
        info " "

        ask(:db_user, 'revisit')
        ask(:db_pass, '')
        ask(:db_name, 'sel')

        require_relative "scripts/db_config.rb"

        tmp_db_config_path = "#{fetch(:local_tmp_dir)}/#{fetch(:stage)}_config.js"
        run_locally do
          unless test("[ -d #{fetch(:local_tmp_dir)} ]")
            execute :mkdir, fetch(:local_tmp_dir)
          end
          open(tmp_db_config_path, 'w') do |f|
            f.puts "#{fetch(:db_config_file_contents)}" 
          end
        end

        on roles(:app) do
          # we upload to tmp and then move to the correct location in order to deal with permissions during upload
          upload! tmp_db_config_path, "/tmp/#{fetch(:stage)}_config.js"
          execute :sudo, "cp /tmp/#{fetch(:stage)}_config.js #{fetch:deploy_to}/shared/config/db/"
        end

        ### cleanup local
        run_locally do
          execute :rm, "-rf", tmp_db_config_path
        end
        
      end
    end

    desc "Setup database snapshots"
    task :snapshots do
      on roles(:app) do
        info " "
        info "-------------------------------"
        info "-- SETUP DATABASE SNAPSHOTS --"
        info "-------------------------------"
        info " "

        ask(:db_user, 'backup')
        ask(:db_pass, '')

        require_relative "scripts/db_backup.rb"

        tmp_db_backup_path = "#{fetch(:local_tmp_dir)}/#{fetch(:application)}_db_backup.sh"
        run_locally do
          unless test("[ -d #{fetch(:local_tmp_dir)} ]")
            execute :mkdir, fetch(:local_tmp_dir)
          end
          open(tmp_db_backup_path, 'w') do |f|
            f.puts "#{fetch(:db_backup_file_contents)}" 
          end
        end

        on roles(:app) do
          # we upload to tmp and then move to the correct location in order to deal with permissions during upload
          upload! tmp_db_backup_path, "/tmp/#{fetch(:application)}_db_backup.sh"
          execute :sudo, "cp /tmp/#{fetch(:application)}_db_backup.sh /etc/cron.daily/#{fetch(:application)}_db_backup"
          execute :sudo, "chmod +x /etc/cron.daily/#{fetch(:application)}_db_backup"
        end

        ### cleanup local
        run_locally do
          execute :rm, "-rf", tmp_db_backup_path
        end
        
      end
    end

  end

  desc "Create and upload upstart script for this node app"
  task :upstart do
    run_locally do
      info " "
      info "---------------------------"
      info "-- CREATE UPSTART CONFIG --"
      info "---------------------------"
      info " "
    end
    
    # load in upstart config content
    require_relative "scripts/upstart-config.rb"

    tmp_upstart_config_path = " #{fetch(:local_tmp_dir)}/#{fetch(:upstart_job_name)}.conf"
    run_locally do
      unless test("[ -d #{fetch(:local_tmp_dir)} ]")
        execute :mkdir, fetch(:local_tmp_dir)
      end
      open(tmp_upstart_config_path, 'w') do |f|
        f.puts "#{fetch(:upstart_file_contents)}" 
      end
    end

    on roles(:app) do
      # we upload to tmp and then move to the correct location in order to deal with permissions during upload
      upload! tmp_upstart_config_path, "/tmp/revisit.conf"
      execute :sudo, "cp /tmp/revisit.conf #{fetch(:upstart_conf_file_path)}"
    end

    run_locally do
      execute :rm, tmp_upstart_config_path
    end

  end


end


namespace :node do

  desc "Start the node application"
  task :start do
    on roles(:app) do
      status = capture("initctl status #{fetch:upstart_job_name}")
      unless status.include? "#{fetch:upstart_job_name} start/running"
        execute :sudo, "start #{fetch(:upstart_job_name)}"
      else
        info "Service already running."
      end
    end
  end


  desc "Stop the node application"
  task :stop do
    on roles(:app) do
      status = capture("initctl status #{fetch:upstart_job_name}")
      if status.include? "#{fetch:upstart_job_name} start/running"
        execute :sudo, "stop #{fetch(:upstart_job_name)}"
      else
        info "Service already stopped."
      end
    end
  end


  desc "Restart the node application"
  task :restart do
    on roles(:app) do
      invoke 'node:stop'
      invoke 'node:start'
    end
  end

  desc "Check if application is running"
  task :status do
    on roles(:app) do
      status = capture("initctl status #{fetch:upstart_job_name}")
      if status.include? "#{fetch:upstart_job_name} start/running"
        info "server running"
      else
        error "server not running"
      end
    end
  end
end




namespace :deploy do

  # desc 'Restart application server (using upstart job) - this happens for both deployment and rollback.'
  task :restart do
    invoke 'node:restart'
  end
  

end


before 'deploy', 'setup:servercheck'

# After the app is published, restart the server
after 'deploy:published', 'deploy:restart'

# Before restarting the server, make sure the upstart config is present
# before 'deploy:restart', 'node:check_upstart_config'
