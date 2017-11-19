"use strict";

const RoomModel = require('../models').Room;
const ApiError = require('../errors/ApiError');

module.exports = {
  joinRoom : joinRoom,
  connectUser : connectUser,
  disconnectUser : disconnectUser,
  getRoomMessages : getRoomMessages,
  getInternalRoomData : getInternalRoomData,
  getUserJoinedRooms : getUserJoinedRooms
};

function connectUser(userId, roomId) {
  // add user to current connection list of room
  // Return new user and current list connections
}

function disconnectUser(userId, roomId) {
  // Remove user out of current connection list of room
  // Return removed user and current list connections
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
  let _selectedRoom;

  return RoomModel.getRoomByCodeOrID(roomId)
  .then(room => {
    _selectedRoom = room;

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
