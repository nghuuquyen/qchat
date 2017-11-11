"use strict";

let router = require('express').Router();
let NotFoundError = require('../errors/NotFoundError');

// Application routes
router.use('/', require('./core.server.routes'));
router.use('/author', require('./author.server.routes'));

module.exports = router;
