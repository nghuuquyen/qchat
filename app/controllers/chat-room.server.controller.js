"use strict";
const ChatRoom = require('../models/ChatRoom');
const ApiError = require('../errors/ApiError');

module.exports = {
  renderChatRoomPage : renderChatRoomPage,
  getRoomByCode : getRoomByCode,
  getRoomData : getRoomData,
  joinRoom : joinRoom,
  getMessages : getMessages,
  getUserRooms : getUserRooms
};


/**
* @name renderChatRoomPage
* @description
* Render chat page.
*
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
*/
function renderChatRoomPage(req, res) {
  res.render('pages/chat/index', {
    user : req.user
  });
}

/**
* @name getRoomByCode
* @description
* Get room by code.
*
* @method GET api/room/:roomCode
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {function} next Next middleware
*/
function getRoomByCode(req, res, next) {
  let roomCode = req.params.roomCode;

  ChatRoom.getRoomByCode(roomCode).then(room => {
    res.json(room);
  })
  .catch(err => next(err));
}


/**
* @name getRoomData
* @description
* Get room data by code, include chat messages and joined users.
*
* @method GET api/secure/room/:roomCode
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {function} next Next middleware
*/
function getRoomData(req, res, next) {
  let roomCode = req.params.roomCode;

  ChatRoom.getRoomData(req.user, roomCode).then(room => {
    res.json(room);
  })
  .catch(err => next(err));
}

/**
* @name getRoomData
* @description
* Get room data by code, include chat messages and joined users.
*
* @method GET api/secure/room/:roomCode
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {function} next Next middleware
*/
function joinRoom(req, res, next) {
  let roomCode = req.params.roomCode;
  let password = req.body.password;

  if(!password) {
    res.send(new ApiError(400, "'password' is required"));
  }

  ChatRoom.joinRoom(req.user, roomCode, password).then(room => {
    res.json(room);
  })
  .catch(err => next(err));
}

/**
* @name getMessages
* @description
* API used for load more messages.
*
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {function} next Next middleware
*/
function getMessages(req, res, next) {
  let roomCode = req.params.roomCode;
  let page = req.params.page;

  ChatRoom.getRoomByCode(roomCode).then(room => {
    return ChatRoom.ensureUserJoinRoom(req.user, room);
  })
  .then(room => {
    return ChatRoom.getMessages(roomCode, page);
  })
  .then(messages => {
    res.json(messages);
  })
  .catch(err => next(err));
}

/**
* @name getUserRooms
* @description
* Get all joined rooms of current logged user
*
* @param  {object}   req  HTTP request
* @param  {object}   res  HTTP response
* @param  {function} next Next middleware
*/
function getUserRooms(req, res, next) {
  ChatRoom.getUserRooms(req.user).then(rooms => {
    res.json(rooms);
  })
  .catch(err => next(err));
}
