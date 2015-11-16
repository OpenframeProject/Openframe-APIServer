var restifyMongoose = require('restify-mongoose'),
  ArtworkModel = require('../domain/model/artwork'),
  // the restify-mongoose model to endpoint mappings
  artworkMappings = restifyMongoose(ArtworkModel, {
    populate: 'author_user,added_by,liked_artwork,format'
  }),
  socket_conn;

// This is a projection translating _id to id and not including password/salt
// var artworkProjection = function(req, item, cb) {
//   var artwork = {
//     id: item._id,
//     username: item.username,
//     website: item.website,
//     liked_artwork: item.liked_artwork,
//     updated_on: item.updated_on,
//     created_on: item.created_on
//   };
//   cb(null, artwork);
// };


module.exports = function(server, io) {

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


  server.get('/artwork/ws/:id', function(req, res, next) {
    if (!socket_conn) {
      res.send('no connection');
      next();
    }

    ArtworkModel.findById(req.params.id).populate('author_user added_by format').then(function(artwork) {
      socket_conn.emit('command:artwork:update', artwork);
      res.json(artwork);
      next();
    });

  });

  // socket.io event handlers

  io.sockets.on('connection', function(socket) {
    socket_conn = socket;

    socket.on('artwork::updated', function(data) {
      console.log(data);
    });

    socket.on('command:artwork:random', function(data) {
      ArtworkModel.random(function(err, artwork) {
        console.log(err, artwork);
        socket_conn.emit('command:artwork:update', artwork);
      });
    });

    socket.emit('test', {
      test: 'data'
    });

  });
};
