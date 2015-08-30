var UserModel = require('../domain/model/user'),
    restify = require('restify'),
    _ = require('lodash-node');

module.exports = function (server, io) {
  server.get('/users', function(req, res, next) {
    UserModel.find().then(function(result) {
      res.send(result);
      next();
    });
  });

  server.get('/users/:username', function(req, res, next) {
    UserModel.findByUsername(req.params.username).then(function(result) {
      if (_.isEmpty(result)) {
        return next(new restify.NotFoundError());
      }
      res.send(result);
      next();
    });
  });

  server.get('/users/:username/collection', function(req, res, next) {
    UserModel.getUserCollection(req.params.username).then(function(result) {
      res.send(result);
      next();
    });
  });

  server.put('/users/:username', function(req, res, next) {
    res.send('update a user');
    next();
  });

  server.post('/users', function(req, res, next) {
    var user = new UserModel(req.params);
    user.save(function(err) {
      if (err) return console.log(err);
      res.send(user);
      next();
    });
    next();
  });

  server.del('/users/:username', function(req, res, next) {
    res.send('deleting ' + req.params.username);
    next();
  });

  io.sockets.on('connection', function(socket) {
    socket.on('frame::updated', function(data) {
      console.log(data);
    });
  });
};