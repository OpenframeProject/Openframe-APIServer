module.exports = function(Stream) {
  var app = Stream.app;

  Stream.disableRemoteMethod('create', true); // Removes (POST) /products
  Stream.disableRemoteMethod('upsert', true); // Removes (PUT) /products
  Stream.disableRemoteMethod('deleteById', true); // Removes (DELETE) /products/:id
  Stream.disableRemoteMethod("updateAll", true); // Removes (POST) /products/update
  Stream.disableRemoteMethod("updateAttributes", false); // Removes (PUT) /products/:id
  Stream.disableRemoteMethod('createChangeStream', true); // removes (GET|POST) /products/change-stream

  Stream.public = function(cb) {
    var Artwork = Stream.app.models.Artwork;
    Artwork.find({ order: 'created DESC' },function(err, artwork) {
      cb(null, artwork);
    });
  };

  Stream.remoteMethod(
    'public', {
      'http': {
        'verb': 'get'
      },
      returns: {
        arg: 'artwork',
        type: 'object'
      }
    }
  );
};
