"use strict";

const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;
const UserRoomDAO = Mongoose.model('UserRoom');
const RoomDAO = Mongoose.model('Room');
const ChatMessageDAO = Mongoose.model('ChatMessage');
const ApiError = require('../errors/ApiError');

const LIMIT_LOAD_MESSAGES = 50;

/**
* @todo Implement methods removeUser
* @todo Implement methods acceptUser
* @todo Implement methods requestJoinRoom
*/
module.exports = {
  joinRoom,
  createRoom,
  isJoined,
  getRoomByCodeOrID,
  getRoomMessages,
  getAllUserInRoom,
  getUserJoinedRooms
};

/**
* @name getRoomByCode
* @description
* Get room information by room code.
*
* @param  {string}  roomIdOrCode Room ID or code
* @return {promise.<object>} Room have given code.
*/
function getRoomByCodeOrID(roomIdOrCode) {
  const _cond = {
    $or:[
      { code : roomIdOrCode }
    ]
  };

  // When find by ObjectId we must check and cast it.
  if(ObjectId.isValid(roomIdOrCode)) {
    _cond.$or.push({
      _id : new ObjectId(roomIdOrCode)
    });
  }

  return RoomDAO.findOne(_cond).then(room => {
    if(room) return room;

    throw new ApiError('Room not found.');
  });
}

/**
* @name createRoom
* @description
* Do create new room
*
* @param  {object} room      Room data.
* @param  {string} authorId  Author ID.
* @return {promise.<object>} Room after created.
*/
function createRoom(room, authorId) {
  return RoomDAO.create({
    name : room.name || 'No Name',
    password : room.password,
    author : authorId
  })
  .then(newRoom => {
    // After create we need join author to that room.
    return joinRoom(newRoom.author, newRoom.id).then(() => newRoom);
  });
}

/**
* @name joinRoom
* @description
* Do create and save join room information to database.
*
* @param  {string} roomId Room ID.
* @param  {number} userId User ID
* @return {promise.<object>} New Joined room object.
*/
function joinRoom(userId, roomId) {
  const record = new UserRoomDAO({
    user : userId,
    room : roomId,
    status : 'JOINED'
  });

  return record.save().then(doc => {
    // Return new joined room.
    return getRoomByCodeOrID(doc.room);
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
  return UserRoomDAO.find({ user : userId })
  .populate('room').then(docs => {
    let _rooms = [];

    for(let i in docs) {
      _rooms.push(docs[i].room);
    }

    return _rooms;
  });
}

/**
* @name getAllUserInRoom
* @description
* Get all users in room. It include joined, pending and blocked user status.
*
* @param  {string} roomId    Room ID.
* @return {promise.<object>} Object with 3 arrays inside
*                            joined, pending and blocked.
*/
function getAllUserInRoom(roomId) {
  return UserRoomDAO.find({ room : roomId })
  .populate('user').then(docs => {
    let users = {
      joined : [],
      pending : [],
      blocked : []
    };

    for(let i in docs) {
      let user = docs[i].user;
      switch (docs[i].status) {
        case 'JOINED': {
          users.joined.push(user);
          break;
        }
        case 'PENDING': {
          users.pending.push(user);
          break;
        }
        case 'BLOCKED': {
          users.blocked.push(user);
          break;
        }
      }
    }

    return users;
  });
}

/**
* @name getRoomMessages
* @description
* Get room messages by page number, default page number is 0.
*
* @param  {string} roomId         Room id.
* @param  {Number} [pageNumber=0] Page number for calculate skip.
* @return {promise.<array>}       Messages
*/
function getRoomMessages(roomId, pageNumber = 0) {
  return ChatMessageDAO.find({ room : roomId })
  .populate('author')
  .limit(LIMIT_LOAD_MESSAGES)
  .skip(pageNumber * LIMIT_LOAD_MESSAGES)
  .sort({ createdAt: 1 });
}

/**
* @name isJoined
* @description
* Check if given user is joined given room or not.
*
* @param  {object}  userId  User ID
* @param  {string}  roomId  Room ID
* @return {promise.<boolean>} TRUE if joined and FALSE if not.
*/
function isJoined(userId, roomId) {
  return UserRoomDAO.findOne({
    user: userId,
    room : roomId
  })
  .then(doc => {
    if(doc) return true;

    return false;
  });
}
