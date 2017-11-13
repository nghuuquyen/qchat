"use strict";

let router = require('express').Router();
let NotFoundError = require('../errors/NotFoundError');

// Application routes
router.use(require('./core.server.routes'));
router.use(require('./authentication.server.routes'));
router.use(require('./chat-room.server.routes'));

module.exports = router;
