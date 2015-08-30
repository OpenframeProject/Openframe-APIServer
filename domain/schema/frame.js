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
    ref: 'User'
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
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
  }
});

module.exports = FrameSchema;
