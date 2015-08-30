use admin;
db.createUser({
    user: 'userAdmin',
    pwd: 'password',
    roles: [{
        role: "userAdminAnyDatabase",
        db: "admin"
    }]
});