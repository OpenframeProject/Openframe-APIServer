set :provision_file_contents, lambda {
<<EOD
#!/bin/sh

# Update apt-get package list
sudo apt-get update

# Install Deps
sudo apt-get -y install git
sudo apt-get -y install nodejs
sudo apt-get -y install npm
sudo apt-get -y install nginx

# Install latest stable mongo release (see http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/)
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# symlink to nodejs
sudo ln -s /usr/bin/nodejs /usr/bin/node

# install bunyan globally
sudo npm install -g bunyan

# Create Dirs
sudo mkdir -p /var/www/api/shared/config/db
sudo mkdir -p /var/www/site
sudo mkdir -p /var/db_snapshots
sudo mkdir -p /var/log/revisit-server

# Update Perms
sudo chown -R #{fetch:user}:#{fetch:user} /var/www
sudo chmod -R +w /var/log/revisit-server

# Setup mongo users
mongo < ./scripts/mongo/create_user_admin.js
mongo -u userAdmin -p password --authenticationDatabase admin < ./scripts/mongo/create_revisit_user.js
mongo -u userAdmin -p password --authenticationDatabase admin < ./scripts/mongo/create_backup_user.js
EOD
}