var ArtworkModel = require('../domain/model/artwork');

module.exports = function(server, io) {

  //
  // REST API
  //

  server.get('/artwork', function(req, res, next) {
    ArtworkModel.find().then(function(result) {
      res.send(result);
      next();
    });
  });

  server.get('/artwork/:artwork_id', function(req, res, next) {
    res.send('get artwork ' + req.params.artwork_id);
    next();
  });

  server.put('/artwork/:artwork_id', function(req, res, next) {
    res.send('update artwork ' + req.params.artwork_id);
    next();
  });

  server.post('/artwork', function(req, res, next) {
    var artwork = new ArtworkModel(req.params);
    artwork.save(function(err) {
      if (err) return handleError(err);
      res.send(artwork);
      next();
    });
  });

  server.del('/artwork/:artwork_id', function(req, res, next) {
    res.send('deleting artwork ' + req.params.artwork_id);
    next();
  });


  //
  // socket.io event handlers
  //

  io.sockets.on('connection', function(socket) {
    socket.on('artwork::updated', function(data) {
      console.log(data);
    });
  });
};
