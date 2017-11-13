"use strict";

const Mongoose = require('mongoose');
const UserRoom = Mongoose.model('UserRoom');
const Room = Mongoose.model('Room');
const ChatMessage = Mongoose.model('ChatMessage');
const User = Mongoose.model('User');
const ApiError = require('../errors/ApiError');

const LIMIT_LOAD_MESSAGES = 50;

/**
* @todo Imlpement methods removeUser
* @todo Imlpement methods acceptUser
* @todo Imlpement methods requestJoinRoom
*/
module.exports = {
  getRoomByCode : getRoomByCode,
  getRoomData : getRoomData,
  joinRoom : joinRoom,
  getMessages : getMessages,
  ensureUserJoinRoom : ensureUserJoinRoom
};

/**
* @name getRoomByCode
* @description
* Get room information by room code.
*
* @param  {string}  roomCode Room code
* @return {promise.<object>} Room have given code.
*/
function getRoomByCode(roomCode) {
  return Room.findOne({ code : roomCode }).then(room => {
    if(room) return room;

    throw new ApiError('Room not found.');
  });
}

/**
* @name getRoomData
* @description
* Get room data by room code. If request user not joined
* in selected room then we will reject and return error.
*
* @param  {object}  user     Request user need get room information.
* @param  {string}  roomCode Room code.
* @throws User not joined room error.
*
* @return {promise.<object>} Room have given code.
*/
function getRoomData(user, roomCode) {
  let selectedRoom;

  return getRoomByCode(roomCode)
  .then(room => {
    return ensureUserJoinRoom(user, room);
  })
  .then(room => {
    // Cover from mongoose object to normal JS object.
    // If not, we can not change object properties.
    return room.toObject();
  })
  .then(populateRoomUsers)
  .then(populateRoomChatMessages)
  .then(room => {
    // For security problem.
    delete room.password;
    delete room.salt;

    return room;
  });
}

function ensureUserJoinRoom(user, room) {
  return checkIsJoined(user, room).then(isJoined => {
    if(isJoined) return room;

    throw new ApiError('User not joined this room');
  });
}

function populateRoomUsers(room) {
  return UserRoom.find({ room : room }).populate('user')
  .then(docs => {
    room.joined = [];
    room.pending = [];

    for(let i in docs) {
      let user = docs[i].user;
      switch (docs[i].status) {
        case 'JOINED': {
          room.joined.push(user);
          break;
        }
        case 'PENDING': {
          room.pending.push(user);
          break;
        }
        case 'BLOCKED': {
          room.blocked.push(user);
          break;
        }
      }
    }

    return room;
  });
}

function populateRoomChatMessages(room) {
  return ChatMessage.find({ room : room })
  .limit(LIMIT_LOAD_MESSAGES)
  .sort({ createdAt: -1 })
  .then(docs => {
    room.messages = docs;

    return room;
  });
}

/**
* @name getMessages
* @description
* Get message by page number, default page number is 0.
*
* @param  {string} roomCode       Room code.
* @param  {Number} [pageNumber=0] Page number for calculate skip.
* @return {promise.<array>}       Messages
*/
function getMessages(roomCode, pageNumber = 0) {
  return getRoomByCode(roomCode)
  .then(room => {
    return ChatMessage.find({ room : room })
    .limit(LIMIT_LOAD_MESSAGES)
    .skip(pageNumber * LIMIT_LOAD_MESSAGES)
    .sort({ createdAt: -1 });
  })
  .then(messages => {
    return messages;
  });
}

/**
* @name checkIsJoined
* @description
* Check if given user is joined given room or not.
* @param  {object}  user  User need to check
* @param  {string}  room  Room object
* @return {boolean} TRUE if joined and FALSE if not.
*/
function checkIsJoined(user, room) {
  return UserRoom.findOne({
    user: user.id,
    room : room.id
  }).then(doc => {
    if(doc) return true;

    return false;
  });
}

/**
* @name joinRoom
* @description
* Join user to selected room by room code.
*
* @param  {object}  user     Request user need join into room.
* @param  {string}  roomCode Room code.
* @param  {string}  password Room password.
* @return {promise.<object>} User room object after created.
*/
function joinRoom(user, roomCode, password) {
  let _selectedRoom;

  return getRoomByCode(roomCode)
  .then(room => {
    _selectedRoom = room;

    if(room.authenticate(password)) {
      return checkIsJoined(user, room);
    }

    throw new ApiError('Password of room not correct.');
  })
  .then(isJoined => {
    if(isJoined) throw new ApiError('User already joined');

    const userRoom = new UserRoom({
      user : user,
      room : _selectedRoom,
      status : 'JOINED'
    });

    return userRoom.save();
  });
}
