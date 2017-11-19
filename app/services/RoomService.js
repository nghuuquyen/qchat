"use strict";

const RoomModel = require('../models').Room;
const RoomConnectionDAO = require('mongoose').model('RoomConnection');

const ApiError = require('../errors/ApiError');

module.exports = {
  joinRoom : joinRoom,
  connectUser : connectUser,
  disconnectUser : disconnectUser,
  getRoomMessages : getRoomMessages,
  getInternalRoomData : getInternalRoomData,
  getUserJoinedRooms : getUserJoinedRooms
};

/**
* @name connectUser
* @description
* Add user to current connection list of room.
*
* @param  {string}  userId    Request user ID.
* @param  {string}  socketId  Socket ID of connection.
* @param  {string}  roomId    Room ID or room code.
* @return {promise.array}  Current connections list.
*/
function connectUser(userId, socketId, roomId) {
  return ensureUserJoinRoom(userId, roomId).then(() => {
    return RoomConnectionDAO.findOne({
      user : userId,
      socketId : socketId
    });
  })
  .then(connection => {
    if(connection) return connection;

    return RoomModel.getRoomByCodeOrID(roomId).then(room => {
      const newConnection = new RoomConnectionDAO({
        user : userId,
        room : room.id,
        socketId : socketId
      });

      return newConnection.save();
    });
  })
  .then(connection => {
    return getCurrentRoomConnections(connection.room);
  });
}

/**
* @name disconnectUser
* @description
* Remove user out of connection list of room.
*
* @param  {string}  userId    Request user ID.
* @param  {string}  socketId  Socket ID of connection.
* @return {promise.array}  Current connections list.
*
*/
function disconnectUser(userId, socketId) {
  return RoomConnectionDAO.findOneAndRemove({
    user : userId,
    socketId : socketId
  })
  .then(connection => {
    if(connection) {
      return getCurrentRoomConnections(connection.room);
    }

    return null;
  });
}

/**
* @name getCurrentRoomConnections
* @description
*
* @param  {string} roomId Room ID or room code.
* @return {object} Object has two properties
*
* + room : Room of socket connection.
* + connections : Current list connections of room.
*/
function getCurrentRoomConnections(roomId) {
  if(!roomId) return null;

  const getConnections = RoomConnectionDAO.find({ room : roomId }).populate('user');
  const getRoom = RoomModel.getRoomByCodeOrID(roomId);

  return Promise.all([getRoom, getConnections]).then(results => {
    return {
      room : results[0],
      connections : results[1]
    };
  });
}

/**
* @name joinRoom
* @description
* Join user to selected room by room ID If password is valid, otherwise
* it will reject and return errors.
*
* @param  {object}  userId    Request user ID.
* @param  {string}  roomId    Room ID or room code.
* @param  {string}  password  Room password.
* @return {promise.<object>}  User room object after created.
*/
function joinRoom(userId, roomId, password) {
  return RoomModel.getRoomByCodeOrID(roomId)
  .then(room => {
    // TODO: Move authenticate function to RoomModel.
    if(room.authenticate(password)) {
      return RoomModel.isJoined(userId, roomId);
    }

    throw new ApiError('Password of room not correct.');
  })
  .then(isJoined => {
    if(isJoined) throw new ApiError('User already joined');

    return RoomModel.joinRoom(userId, roomId);
  });
}

/**
* @name getInternalRoomData
* @description
* This function will check user has ID equals {userId} joined room has {roomId}
* or not. If yes it will return 50 lasted messages and current list user
* connections of that room. If no it will reject and return error messages.
*
* @param  {string} userId       User ID of user who request get room data.
* @param  {string} roomIdOrCode Room ID or room code.
*
* @throws User not joined room error.
* @return {promise.<object>} Object has below properties
* + joined  : List joined users.
* + pending : List pending users.
* + blocked : List blocked users.
* + connections : Current room connections [{ userId, socketId }].
*/
function getInternalRoomData(userId, roomIdOrCode) {
  return RoomModel.getRoomByCodeOrID(roomIdOrCode)
  .then(room => {
    return ensureUserJoinRoom(userId, room.id).then(() => room);
  })
  .then(room => {
    // Cover from mongoose object to normal JS object.
    // If not, we can not change object properties.
    return room.toObject();
  })
  .then(populateRoomUsers)
  .then(populateRoomMessages)
  .then(room => {
    // For security problem.
    delete room.password;
    delete room.salt;

    return room;
  });
}

/**
* @name getRoomMessages
* @description
* If request user has {userId} already joined room has {roomId} we
* will return messages of room and skip and limit by {pageNumber} .
*
* @param  {string} userId     User ID of user who request get room data.
* @param  {string} roomId     Room ID or room code.
* @param  {number} pageNumber Page number for skip.
* @return {promis.<array>}    Messages
*/
function getRoomMessages(userId, roomId, pageNumber = 0) {
  return RoomModel.getRoomByCodeOrID(roomId)
  .then(room => {
    return ensureUserJoinRoom(userId, room.id).then(() => room);
  })
  .then(room => {
    return RoomModel.getRoomMessages(userId, room.id, pageNumber);
  });
}

/**
* @name getUserJoinedRooms
* @description
* Get all joined room of user has given {userId} ID.
*
* @param  {string} userId    User ID.
* @return {promise.<object>} List joined rooms of user.
*/
function getUserJoinedRooms(userId) {
  return RoomModel.getUserJoinedRooms(userId);
}

/**
* @name ensureUserJoinRoom
* @description
* It will throw {ApiError} if user  have not joined to given room has {roomId}
*
* @param  {string} roomId Room ID.
* @param  {Number} userId User ID
* @return TRUE if user already joined to that room.
*/
function ensureUserJoinRoom(userId, roomId) {
  return RoomModel.isJoined(userId, roomId).then(isJoined => {
    if(isJoined) return true;

    throw new ApiError('User not joined this room');
  });
}

/**
* @name populateRoomUsers
* @description
* Populate list users in room to room object.
*
* @param  {object}           room Room object for populate.
* @return {promise.<object>}      Room after populated
*/
function populateRoomUsers(room) {
  return RoomModel.getAllUserInRoom(room.id).then(users => {
    room.joined  = users.joined;
    room.pending = users.pending;
    room.blocked = users.blocked;

    return room;
  });
}

/**
* @name populateRoomMessages
* @description
* Populate list messages in room to room object.
*
* @param  {object}           room Room object for populate.
* @return {promise.<object>}      Room after populated
*/
function populateRoomMessages(room) {
  return RoomModel.getRoomMessages(room.id, 0).then(messages => {
    room.messages = messages;

    return room;
  });
}
