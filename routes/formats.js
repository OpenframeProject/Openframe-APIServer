var FormatModel = require('../domain/model/format');

module.exports = function(server, io) {

  //
  // REST API
  //

  server.get('/formats', function(req, res, next) {
    FormatModel.find().then(function(result) {
      res.send(result);
      next();
    });
  });

  server.get('/formats/:format_id', function(req, res, next) {
    res.send('get format ' + req.params.format_id);
    next();
  });

  server.put('/formats/:format_id', function(req, res, next) {
    res.send('update format ' + req.params.format_id);
    next();
  });

  server.post('/formats', function(req, res, next) {
    var format = new FormatModel(req.params);
    format.save(function(err) {
      if (err) return console.log(err);
      res.send(format);
      next();
    });
  });

  server.del('/formats/:format_id', function(req, res, next) {
    res.send('deleting format ' + req.params.format_id);
    next();
  });


  //
  // socket.io event handlers
  //

  io.sockets.on('connection', function(socket) {
    socket.on('format::updated', function(data) {
      console.log(data);
    });
  });
};
