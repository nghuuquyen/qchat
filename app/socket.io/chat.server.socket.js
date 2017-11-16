'use strict';
const Mongoose = require('mongoose');
const Room = Mongoose.model('Room');
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
      logger.debug(`User ${_user.username} join room.`);
      addUser(socket, data.code);
    });

    socket.on('message', data => {
      logger.debug(`User ${_user.username} send message in room ${data.code}`);
      sendMessage(socket, data.code, data.message);
    });

    socket.on('disconnect', () => {
      logger.debug(`User ${_user.username} left room.`);
      removeUser(socket);
    });
  });
};

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
    socketId : socket.id
  });

  // Join current socket user to room.
  socket.join(code);

  // Send to members in room.
  socket.broadcast.to(code)
  .emit('has-new-member', {
    username : _user.username,
    id : _user.id
  });
}

function removeUser(socket) {
  const _user = _.get(socket, 'request.user');
  if(!_user) return;

  const _index = connections.findIndex(item => {
    return item.socketId === socket.id;
  });

  // Return if not found user.
  if(_index === -1) return;

  // Leave user out room.
  socket.leave(connections[_index].code);

  // Emit event to other member in room.
  socket.broadcast.to(connections[_index].code)
  .emit('remove-user', {
    username : _user.username,
    id : _user.id
  });

  connections.splice(_index, 1);
}

function sendMessage(socket, code, message) {
  connections.forEach(room => {
    if(room.code === code && room.socketId) {
      socket.broadcast.to(room.code).emit('message', message);
    }
  });
}
