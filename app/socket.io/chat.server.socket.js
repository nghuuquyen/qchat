'use strict';

const RoomService = require('../services').Room;
const ChatMessage =  require('mongoose').model('ChatMessage');
const logger = require('../../config/lib/logger');

const _ = require('lodash');

let rooms = [];
// contain item { code : '', socketId : '' }
let connections = [];

// Create the chat configuration
module.exports = function (io) {

  // Chatroom namespace
  io.of('/chatroom').on('connection', socket => {
    const _user = socket.request.user;
    logger.debug(`User ${_user.username} connected for chatting.`);

    socket.on('join', data => {
      // TODO: Must check if user have permission to join room.
      logger.debug(`User ${_user.username} join room.`);
      joinRoom(socket, data.code);
    });

    socket.on('message', data => {
      // TODO: Must check if user have permission send message to room.
      logger.debug(`User ${_user.username} send message in room ${data.code}`);
      sendMessage(socket, data.code, data.message);
    });

    socket.on('disconnect', () => {
      logger.debug(`User ${_user.username} left room.`);
      leftRoom(socket);
    });
  });
};


function joinRoom(socket, roomCode) {
  const _user = _.get(socket, 'request.user');

  RoomService.connectUser(_user.id, socket.id, roomCode)
  .then(data => {
    if(!data) return;

    socket.broadcast.to(data.room.code).emit('has-new-member', data.connections);
  });
}

function leftRoom(socket) {
  const _user = _.get(socket, 'request.user');

  RoomService.disconnectUser(_user.id, socket.id)
  .then(data => {
    if(!data) return;
    
    socket.broadcast.to(data.room.code).emit('member-logout', data.connections);
  });
}



function broadcastMessage(socket, message) {
  // RoomService.isJoined(userId, roomCode);
  // If joined -> ChatService.saveMessage() -> Socket broadcast message;
}

function sendMessage(socket, code, message) {
  // Save message to database.
  const msg = new ChatMessage({
    content: message.content || '',
    roomCode : code,
    author : socket.request.user
  });

  msg.save().then(message => {
    // Emit to room members
    socket.broadcast.to(code).emit('message', {
      content : message.content,
      author : _.get(socket, 'request.user')
    });
  });
}
