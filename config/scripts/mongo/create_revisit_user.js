use sel
db.createUser({
    user: 'revisit',
    pwd: 'password',
    roles: [{
        role: "readWrite",
        db: "sel"
    }]
})