"use strict";

const Mongoose = require('mongoose');
const Room = Mongoose.model('Room');
const User = Mongoose.model('User');
const ChatMessage = Mongoose.model('ChatMessage');
const RamdomString = require('../helpers/RamdomString');

function doSeeds() {
  new Room();
  new User();
  new ChatMessage();

  User.findOne({ username : 'nghuuquyen' }).then(user => {
    let room = new Room({
      name : 'Room ' + RamdomString(12, 'aA#'),
      password : '123456789',
      author : user
    });

    return room.save();
  })
  .then(room => {
    let chatMessage = new ChatMessage({
      content : 'Chat message ' + RamdomString(12, 'aA#'),
      password : '123456789',
      room : room,
      author : room.author
    });

    return chatMessage.save();
  });
}

function doRemove() {

}

module.exports = function () {
  doSeeds();
  doRemove();
};
