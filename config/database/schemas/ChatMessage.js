'use strict';

var Mongoose  = require('mongoose');

/**
* Each connection object represents a user connected through a unique socket.
* Each connection object composed of {userId + socketId}. Both of them together are unique.
*
*/
var ChatMessageSchema = new Mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  slug: { type: String, required: true }
});

module.exports = Mongoose.model('ChatMessage', ChatMessageSchema);
