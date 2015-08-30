// deps
var SHA2 = new(require('jshashes').SHA512)(),
    crypto = require('crypto');

// local includes
var responses = require('./../view/responses.js'),
    UserModel = require('./../domain/model/user.js'),
    conf = require('./../config/app/config.js'),
    log = require('./../core/logger.js').log;

var USE_AUTH = conf.USE_AUTH,
    ALLOW_GET = conf.ALLOW_GET,
    ALLOW_POST = conf.ALLOW_POST,
    ALLOW_PUT = conf.ALLOW_PUT,
    BLOCK_USERS = conf.BLOCK_USERS;

function authenticate(req, res, next) {

    var anyUserPath = new RegExp(conf.prePath + "/users.*$");
    var anyShowDeletedPath = new RegExp("(&showDeleted|\\?showDeleted)");

    function login(req, callback) {
        req.log.info("Basic auth verification", {
            "user": res.username,
            "auth": req.authorization
        });

        if (req.username === 'anonymous' || typeof req.authorization.basic === 'undefined') {
            req.log.info("Basic auth failed");
            callback(false, "No basic auth information provided");
            return;
        }

        log.debug('UserModel...', UserModel);

        UserModel.login(req.username,
            req.authorization.basic.password,
            function(success, role) {
                callback(success, "", role);
            }
        );
    }
    // if auth is disabled, even user endpoints will be visible
    if (!_useAuth()) {
        return next();
    }

    // Branch for requests dealing with user endpoints
    if (_blockUsers() && anyUserPath.test(req.url)) {
        login(req, function(logged, msg, role) {
            if (!logged) {
                req.log.info("User end point not auth'd");
                return responses.apiForbidden(res, req.username);
            }

            if (role !== "admin") {
                req.log.info("User end point not auth'd");
                return responses.apiForbidden(res, req.username);
            }

            // Might as well move on then if youre admin
            return next();
        });

        return;
    }

    if (anyShowDeletedPath.test(req.url)) {
        login(req, function(logged, msg, role) {
            if (!logged) {
                req.log.info("Trying to show deleted as anon");
                return responses.apiForbidden(res, req.username);
            }

            if (role !== "admin") {
                req.log.info("Trying to show deleted as non admin");
                return responses.apiForbidden(res, req.username);
            }

            // Might as well move on then if youre admin
            return next();
        });

        return;
    }

    // Branch for level of authentication required
    if (_allowGet() && req.method === 'GET') {
        return next();
    }

    if (_allowPost() && req.method === 'POST') {
        return next();
    }

    if (_allowPut() && req.method === 'PUT') {
        return next();
    }

    // Delete should always be authenticated 
    login(req, function(logged, msg) {
        if (!logged) {
            req.log.info("Basic auth failed");
            return responses.apiUnauthorized(res, req.username, msg);
        }

        req.log.info("Basic auth passed");
        return next();

    });

}


_useAuth = function(use) {
    if (typeof use === "boolean") {
        USE_AUTH = use;
    }
    return USE_AUTH;
};

_allowGet = function(allow) {
    if (typeof allow === "boolean") {
        ALLOW_GET = allow;
    }
    return ALLOW_GET;
};

_allowPut = function(allow) {
    if (typeof allow === "boolean") {
        ALLOW_PUT = allow;
    }
    return ALLOW_PUT;
};

_allowPost = function(allow) {
    if (typeof allow === "boolean") {
        ALLOW_POST = allow;
    }
    return ALLOW_POST;
};

_blockUsers = function(allow) {
    if (typeof allow === "boolean") {
        BLOCK_USERS = allow;
    }
    return BLOCK_USERS;
};

exports.useAuth = _useAuth;
exports.allowGet = _allowGet;
exports.allowPut = _allowPut;
exports.allowPost = _allowPost;
exports.blockUsers = _blockUsers;

// middleware
// module.exports = authenticate;

exports.authenticate = authenticate;