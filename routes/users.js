var restifyMongoose = require('restify-mongoose'),
  UserModel = require('../domain/model/user'),
  // the restify-mongoose model to endpoint mappings
  userMappings = restifyMongoose(UserModel, {
    queryString: 'username'
  });

// This is a projection translating _id to id and not including password/salt
var userProjection = function(req, item, cb) {
  var user = {
    id: item._id,
    username: item.username,
    website: item.website,
    liked_artwork: item.liked_artwork,
    updated_on: item.updated_on,
    created_on: item.created_on
  };
  cb(null, user);
};


module.exports = function(server, io) {

  // REST handlers

  server.get('/users', userMappings.query({
    projection: userProjection,
    outputFormat: 'json-api',
    modelName: 'users'
  }));
  server.get('/users/:id', userMappings.detail({
    projection: userProjection,
    populate: 'liked_artwork'
  }));
  server.post('/users', userMappings.insert());

  // TODO: put and patch are synonomous at the moment...
  server.put('/users/:id', userMappings.update());
  server.patch('/users/:id', userMappings.update());

  server.del('/users/:id', userMappings.remove());

  // socket.io event handlers

  io.sockets.on('connection', function(socket) {
    socket.on('artwork::updated', function(data) {
      console.log(data);
    });
  });
};
