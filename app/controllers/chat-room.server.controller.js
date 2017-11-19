"use strict";

const RoomService = require('../services').Room;
const ApiError = require('../errors/ApiError');

module.exports = {
  renderChatRoomPage : renderChatRoomPage,
  joinRoom : joinRoom,
  getRoomByCode : getRoomByCode,
  getInternalRoomData : getInternalRoomData,
  getMessages : getMessages,
  getUserJoinedRooms : getUserJoinedRooms
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
  RoomService.getRoomByCodeOrID(req.params.roomCode)
  .then(room => {
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
function getInternalRoomData(req, res, next) {
  RoomService.getInternalRoomData(req.user.id, req.params.roomCode)
  .then(room => {
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
  const roomCode = req.params.roomCode;
  const password = req.body.password;

  if(!password) {
    res.send(new ApiError(400, "'password' is required"));
  }

  RoomService.joinRoom(req.user.id , roomCode, password)
  .then(room => {
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
  const roomCode = req.params.roomCode;
  const page = req.params.page;

  RoomService.getRoomByCodeOrID(roomCode)
  .then(room => {
    return RoomService.ensureUserJoinRoom(req.user, room);
  })
  .then(room => {
    return RoomService.getRoomMessages(roomCode, page);
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
function getUserJoinedRooms(req, res, next) {
  RoomService.getUserJoinedRooms(req.user.id)
  .then(rooms => {
    res.json(rooms);
  })
  .catch(err => next(err));
}
