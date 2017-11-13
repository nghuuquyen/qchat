'use strict';

const Mongoose  = require('mongoose');
const Schema = Mongoose.Schema;

var UserRoomSchema = new Mongoose.Schema({
  room : {
    type : Schema.Types.ObjectId,
    required : 'Room not allow empty',
    ref : 'Room'
  },
  user : {
    type : Schema.Types.ObjectId,
    required : 'Author not allow empty',
    ref : 'User'
  },
  // JOINED, PENDING, BLOCKED
  status : {
    type: String,
    required : 'Status not allow empty'
  },
  updatedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('UserRoom', UserRoomSchema, 'user_rooms');
