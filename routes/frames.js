var restifyMongoose = require('restify-mongoose'),
  FrameModel = require('../domain/model/frame'),
  // the restify-mongoose model to endpoint mappings
  frameMappings = restifyMongoose(FrameModel);

// This is a projection translating _id to id and not including password/salt
var frameProjection = function(req, item, cb) {
  var frame = {
    id: item._id,
    name: item.name,
    settings: item.settings,
    users: item.users,
    owner: item.owner
  };
  cb(null, frame);
};

module.exports = function(server, io) {

  // REST handlers

  server.get('/frames', frameMappings.query({
    projection: frameProjection,
    outputFormat: 'json-api',
    modelName: 'frames'
  }));
  server.get('/frames/:id', frameMappings.detail({
    projection: frameProjection
  }));
  server.post('/frames', frameMappings.insert());

  // TODO: put and patch are synonomous at the moment...
  server.put('/frames/:id', frameMappings.update());
  server.patch('/frames/:id', frameMappings.update());

  server.del('/frames/:id', frameMappings.remove());

  // socket.io event handlers

  io.sockets.on('connection', function(socket) {
    socket.on('frame::updated', function(data) {
      console.log(data);
    });
  });
};
