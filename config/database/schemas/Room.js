'use strict';

var Mongoose  = require('mongoose');

/**
* Each connection object represents a user connected through a unique socket.
* Each connection object composed of {userId + socketId}. Both of them together are unique.
*
*/
var RoomSchema = new Mongoose.Schema({
  title: { type: String, required: true },
  connections: { type: [{ userId: String, socketId: String }]}
});

module.exports = Mongoose.model('Room', RoomSchema);
