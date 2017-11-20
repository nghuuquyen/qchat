"use strict";

const ChatMessage = require('mongoose').model('ChatMessage');

module.exports = {
  saveMessage
};


/**
* @name saveMessage
* @description
* Do save message to database.
*
* @param  {string} content Message content
* @param  {string} userId  User ID
* @param  {string} roomId  Room ID
* @return {promise.<object>} Created message object.
*/
function saveMessage(content, userId, roomId) {
  const msg = new ChatMessage({
    content: content || '',
    room : roomId,
    author : userId
  });

  return msg.save();
}
