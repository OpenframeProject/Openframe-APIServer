use admin
db.createUser({
    user: 'backup',
    pwd: 'password',
    roles: [{
        "role": "backup",
        "db": "admin"
    }, {
        "role": "dbAdminAnyDatabase",
        "db": "admin"
    }]
})
