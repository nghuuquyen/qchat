'use strict';

const Mongoose  = require('mongoose');
const Schema = Mongoose.Schema;

var ChatMessageSchema = new Mongoose.Schema({
  content: {
    type: String,
    required: 'Chat message can not empty'
  },
  author : {
    type : Schema.Types.ObjectId,
    required : 'Author not allow empty',
    ref : 'User'
  },
  room : {
    type : Schema.Types.ObjectId,
    required : 'Room not allow empty',
    ref : 'Room'
  },
  updatedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('ChatMessage', ChatMessageSchema, 'chat_messages');
