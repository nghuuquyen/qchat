"use strict";

const router = require('express').Router();
const Ctrl = require('../controllers').ChatRoom;
const ApiError = require('../errors/ApiError');

router.route('/room/:roomCode').get(Ctrl.renderChatRoomPage);

/*
| API Routes
*/
router.route('/api/secure/*', function(req, res, next) {
  if(!req.user) {
    return res.send(new ApiError('User not logged'));
  }

  next();
});

router.route('/api/room/:roomCode')
.get(Ctrl.getRoomByCode);

router.route('/api/secure/room/:roomCode')
.get(Ctrl.getRoomData)
.post(Ctrl.joinRoom);

module.exports = router;
