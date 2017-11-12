"use strict";

let router = require('express').Router();
let NotFoundError = require('../errors/NotFoundError');

// Application routes
router.use(require('./core.server.routes'));
router.use(require('./authentication.server.routes'));

module.exports = router;
