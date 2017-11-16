'use strict';
const Mongoose = require('mongoose');
const Room = Mongoose.model('Room');
const ChatMessage =  Mongoose.model('ChatMessage');
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
      addUser(socket, data.code);
    });

    socket.on('message', data => {
      // TODO: Must check if user have permission send message to room.
      logger.debug(`User ${_user.username} send message in room ${data.code}`);
      sendMessage(socket, data.code, data.message);
    });

    socket.on('disconnect', () => {
      logger.debug(`User ${_user.username} left room.`);
      removeUser(socket);
    });
  });
};

function getUserData(socket) {
  const _user = _.get(socket, 'request.user');
  if(!_user) return;

  var _connections = connections.filter(function(item) {
    return item.user.username === _user.username;
  });

  return {
    user : {
      profileImageURL : _user.profileImageURL,
      username : _user.username,
      id : _user.id
    },
    connections : _connections
  };
}

function getConnectionIndex(code, socketId) {
  return connections.findIndex(item => {
    return (item.code === code) && (item.socketId === socketId);
  });
}

function addUser(socket, code) {
  const _user = _.get(socket, 'request.user');
  if(!_user) return;

  const _index = getConnectionIndex(code, socket.id);

  // Return if user already in room.
  if(_index !== -1) return;

  connections.push({
    code : code,
    socketId : socket.id,
    user : _user
  });

  // Join current socket user to room.
  socket.join(code);

  // Send to members in room.
  socket.broadcast.to(code)
  .emit('has-new-member', getUserData(socket));
}

function removeUser(socket) {
  const _user = _.get(socket, 'request.user');
  if(!_user) return;

  const _index = connections.findIndex(item => {
    return item.socketId === socket.id;
  });

  // Return if not found user.
  if(_index === -1) return;

  const _roomCode = connections[_index].code;
  // Leave user out room.
  socket.leave(_roomCode);

  connections.splice(_index, 1);

  // Emit event to other member in room.
  socket.broadcast.to(_roomCode).emit('user-logout', getUserData(socket));
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
