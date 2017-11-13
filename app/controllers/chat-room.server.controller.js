"use strict";
const ChatRoom = require('../models/ChatRoom');
const ApiError = require('../errors/ApiError');

module.exports = {
  renderChatRoomPage : renderChatRoomPage,
  getRoomByCode : getRoomByCode,
  getRoomData : getRoomData,
  joinRoom : joinRoom
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

  if(!roomCode) {
    res.send(new ApiError(400, "'roomCode' is required"));
  }

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

  if(!roomCode) {
    res.send(new ApiError(400, "'roomCode' is required"));
  }

  ChatRoom.getRoomData(req.user, roomCode).then(room => {
    res.json(room);
  })
  .catch(err => {
    console.log(err);
    next(err);
  });
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

  if(!roomCode) {
    res.send(new ApiError(400, "'roomCode' is required"));
  }

  if(!password) {
    res.send(new ApiError(400, "'password' is required"));
  }

  ChatRoom.joinRoom(req.user, roomCode, password).then(room => {
    res.json(room);
  })
  .catch(err => next(err));
}
