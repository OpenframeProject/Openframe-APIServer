/**
 * NOTE: The Stream model is not fully implemented. It is here as a placeholder for future use.
 *
 * Conceptually, a Stream is a dynamic list of Artwork. The 'public' stream contains all Artwork added
 * by all users. Users might be able to publish their own Streams, which could be 'listened to' by
 * other users.
 *
 * Ideas around streams remain to be fleshed out.
 */
module.exports = function(Stream) {
  var app = Stream.app;

  Stream.disableRemoteMethod('createChangeStream', true);

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
