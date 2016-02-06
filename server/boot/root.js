module.exports = function(server) {
    // Install a `/` route that returns server status
    var router = server.loopback.Router();
    router.get('/user/:username', function(request, response, next) {
        var username = request.params.username;
        response.send(username);
        next();
    });
    server.use(router);
};

