// dependancies
var Schema = require('mongoose').Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique : true,
    dropDups: true,
    index: true
  },
  bio: {
    type: String
  },
  full_name: {
    type: String
  },
  website: {
    type: String
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  liked_artwork: [{
    type: Schema.Types.ObjectId,
    ref: 'ArtworkModel'
  }],
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
});

UserSchema.statics.findByUsername = function(username, cb) {
  return this.find({
    username: username
  }, cb);
};

UserSchema.statics.getUserCollection = function(username, cb) {
  return this.find({
    username: username
  }, 'liked_artwork', cb);
};

module.exports = UserSchema;
