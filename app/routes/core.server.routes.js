"user strict";
/**
* @author Quyen Nguyen Huu
* @module routes
* @name   core.server.routes
*/

let router = require('express').Router();
let CoreCtrl = require('../controllers').Core;

router.route('/').get(CoreCtrl.renderHomePage);
module.exports = router;
