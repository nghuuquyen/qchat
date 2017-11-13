"use strict";

module.exports = {
  renderChatRoomPage : renderChatRoomPage
};

function renderChatRoomPage(req, res) {
  res.render('pages/chat/index', {
    user : req.user
  });
}
