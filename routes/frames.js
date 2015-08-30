module.exports = function (server, io) {
  server.get('/frames', function(req, res, next) {
    res.send('the list of frames.');
    next();
  });

  server.get('/frames/:frame_id', function(req, res, next) {
    res.send('get frame ' + req.params.frame_id);
    next();
  });

  server.put('/frames/:frame_id', function(req, res, next) {
    res.send('update frame ' + req.params.frame_id);
    next();
  });

  server.post('/frames', function(req, res, next) {
    res.send('create new frame');
    next();
  });

  server.del('/frames/:frame_id', function(req, res, next) {
    res.send('deleting frame ' + req.params.frame_id);
    next();
  });

  io.sockets.on('connection', function(socket) {
    socket.on('frame::updated', function(data) {
      console.log(data);
    });
  });
};