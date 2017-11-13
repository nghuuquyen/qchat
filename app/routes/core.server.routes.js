"user strict";

const router = require('express').Router();
const CoreCtrl = require('../controllers').Core;
const ChatRoomCtrl = require('../controllers').ChatRoom;

// Public home page
router.route('/').get(CoreCtrl.renderHomePage);

// Private home page for logged user redirect to
router.route('/home').get(
  CoreCtrl.isAuthenticated,
  ChatRoomCtrl.renderChatRoomPage
);

module.exports = router;
