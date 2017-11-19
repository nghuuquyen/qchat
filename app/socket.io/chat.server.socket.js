'use strict';

const RoomService = require('../services').Room;
const MessageService =  require('../services').Message;

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
      logger.debug(`User ${_user.username} join room ${data.code}`);
      joinRoom(socket, data.code);
    });

    socket.on('message', data => {
      broadcastMessage(socket, data.code, data.message);
    });

    socket.on('disconnect', () => {
      logger.debug(`User ${_user.username} left room`);
      leftRoom(socket);
    });
  });
};

/**
* @name joinRoom
* @description
* Save socketId and request userId to connection list of room.
*
* @param  {object} socket   Request socket instance.
* @param  {object} roomCode Room code
*/
function joinRoom(socket, roomCode) {
  const _user = _.get(socket, 'request.user');

  RoomService.connectUser(_user.id, socket.id, roomCode)
  .then(data => {
    if(!data) return;

    // Connect user to room.
    socket.join(data.room.code);

    socket.broadcast.to(data.room.code).emit('has-new-member', data);
  });
}

/**
* @name leftRoom
* @description
* Remove socketId and request userId to connection list from room.
*
* @param  {object} socket Request socket instance.
*/
function leftRoom(socket) {
  const _user = _.get(socket, 'request.user');

  RoomService.disconnectUser(_user.id, socket.id)
  .then(data => {
    if(!data) return;

    // Remove user from room.
    socket.leave(data.room.code);

    socket.broadcast.to(data.room.code).emit('member-logout', data);
  });
}

/**
* @name broadcastMessage
* @description
* Save and broadcast new message to other members in room.
*
* @param  {object} socket   Socket request instance
* @param  {string} roomCode Room code
* @param  {string} message  Message content
*/
function broadcastMessage(socket, roomCode, message) {
  const _user = _.get(socket, 'request.user');

  MessageService.saveMessage(message.content, _user.id, roomCode)
  .then(message => {
    socket.broadcast.to(roomCode).emit('message', {
      content : message.content,
      author : _.get(socket, 'request.user')
    });
  });
}
