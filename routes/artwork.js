var restifyMongoose = require('restify-mongoose'),
  ArtworkModel = require('../domain/model/artwork'),
  // the restify-mongoose model to endpoint mappings
  artworkMappings = restifyMongoose(ArtworkModel, {populate: 'author_user,added_by,liked_artwork'});

module.exports = function(server, io) {

  // REST handlers

  // server.get('/artwork', function(req, res, next) {
  //   ArtworkModel
  //     .find()
  //     .populate('added_by')
  //     .then(function(result) {
  //       res.json(200, result);
  //       next();
  //     });
  // });
  server.get('/artwork', artworkMappings.query({
    outputFormat: 'json-api',
    modelName: 'artwork'
  }));
  server.get('/artwork/:id', artworkMappings.detail());
  server.post('/artwork', artworkMappings.insert());
  // TODO: put and patch are synonomous at the moment...
  server.put('/artwork/:id', artworkMappings.update());
  server.patch('/artwork/:id', artworkMappings.update());
  server.del('/artwork/:id', artworkMappings.remove());

  // socket.io event handlers

  io.sockets.on('connection', function(socket) {
    socket.on('artwork::updated', function(data) {
      console.log(data);
    });
  });
};
