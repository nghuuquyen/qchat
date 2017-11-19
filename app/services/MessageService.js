"use strict";

const RoomModel = require('../models').Room;
const ChatMessageModel = require('../models').Message;
const ApiError = require('../errors/ApiError');

module.exports = {
  saveMessage
};

/**
* @name saveMessage
* @description
* If user has {userId} joined room, we will create and save message
* to database.
*
* @param  {string} content Message content
* @param  {string} userId  User ID
* @param  {string} roomId  Room ID
* @return {promise.<object>} Created message object.
*/
function saveMessage(content, userId, roomId) {
  return RoomModel.getRoomByCodeOrID(roomId)
  .then(room => {
    return RoomModel.isJoined(userId, room.id)
    .then(isJoined => {
      if(isJoined) {
        return ChatMessageModel.saveMessage(content, userId, room.id);
      }

      throw new ApiError('User not joined this room.');
    });
  });
}
