set :db_backup_file_contents, lambda {
<<EOD
#!/bin/sh
cd /var/db_snapshots/
FILE=dump_$(date "+%Y%d%m_%H%M%S")
FILETAR="$FILE.tar.gz"

# The mongo user performing the backup needs the 'backup' and 'dbAdminAnyDatabase' roles on the admin db.
mongodump -u #{fetch:db_user} -p #{fetch:db_pass} -o "$FILE"
tar -zcf "$FILETAR" "$FILE"
rm -rf $FILE

# remove snapshots older than 30 days
find *.tar.gz -mtime +30 -exec rm {} \\;
EOD
}