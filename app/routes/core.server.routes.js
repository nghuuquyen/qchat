"use strict";

const router = require('express').Router();
const CoreCtrl = require('../controllers').Core;
const ChatRoomCtrl = require('../controllers').ChatRoom;

// Public home page.
router.route('/').get(CoreCtrl.renderHomePage);

// Public about page.
router.route('/about').get((req, res) => {
  res.render('about');
});

// Private user profile page.
router.route('/u/profile').get((req, res) => {
  res.render('profile', {
    user : req.user
  });
});

// Private home page for logged user redirect to
router.route('/u').get(
  CoreCtrl.isAuthenticated,
  ChatRoomCtrl.renderChatRoomPage
);

module.exports = router;
