"user strict";

let router = require('express').Router();
let Ctrl = require('../controllers').ChatRoom;

router.route('/room/:roomCode').get(Ctrl.renderChatRoomPage);

module.exports = router;
