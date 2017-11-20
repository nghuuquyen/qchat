"use strict";

const router = require('express').Router();
const Ctrl = require('../controllers').ChatRoom;
const ApiError = require('../errors/ApiError');

/*
* Page Routes
*/
router.route('/u/room/:roomCode')
.get(Ctrl.renderChatRoomPage);


/*
* API Routes
*/
router.route('/api/secure/*', function(req, res, next) {
  if(!req.user) {
    return res.send(new ApiError(403, 'Authorization Error'));
  }

  next();
});

router.route('/api/room/:roomCode')
.get(Ctrl.getRoomByCode);

router.route('/api/secure/room')
.post(Ctrl.createRoom)
.get(Ctrl.getUserJoinedRooms);

router.route('/api/secure/room/:roomCode')
.get(Ctrl.getInternalRoomData)
.post(Ctrl.joinRoom);

router.route('/api/secure/room/:roomCode/messages/:page')
.get(Ctrl.getMessages);

module.exports = router;
