# Migrations

### Export data
`mongodump -u [user] -p [pass] --db ofsl`

### Import data

`mongorestore dump -u [user] -p [pass]`

### Run migration script

`> cd migrations`
`> mongo`
`mongo> use ofsl`
`mongo> load('new-data-model.js')