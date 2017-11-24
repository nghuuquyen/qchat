'use strict';

const Mongoose  = require('mongoose');
const Schema = Mongoose.Schema;

/**
* Each connection object represents a user connected through a unique socket.
* Each connection object composed of {userId + socketId}. Both of them together are unique.
*/
var RoomConnection = new Mongoose.Schema({
  user : {
    type : Schema.Types.ObjectId,
    required : 'Author not allow empty',
    ref : 'User'
  },
  room : {
    type : Schema.Types.ObjectId,
    required : 'Room not allow empty',
    ref : 'Room'
  },
  socketId : {
    type : String,
    required : 'Socket ID not allow empty'
  },
  updatedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 6 // Auto remove after 6 hours
  }
});

module.exports = Mongoose.model('RoomConnection', RoomConnection, 'room_connections');
