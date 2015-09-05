// dependancies
var Schema = require('mongoose').Schema;

var FrameSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel'
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'UserModel'
  }],
  settings: {
    status: {
      type: String,
      default: 'on'
    },
    rotation: {
      type: Number,
      default: 0
    }
  },
  created_on: {
    type: Date,
    default: Date.now
  }
});

module.exports = FrameSchema;
