"use strict";

const config = require('../config');
const express = require('express');

/**
* @name initLocalVariables
* @description
*
* Initialize local variables for express application,
* after that we can get config value from environment.
*
* @param  {object} app express instance
*/
function initLocalVariables(app) {
  //Setting application local variables
  app.locals.title = config.app.title;
  app.locals.name = config.app.title;
  app.locals.image = config.logo;
  app.locals.description = config.app.description;

  // TODO: Need setup client js and css files.
  //app.locals.jsFiles = config.files.client.js;
  //app.locals.cssFiles = config.files.client.css;

  app.locals.tags = config.app.keywords;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;
  app.locals.hosts = config.hosts;

  // Deploy time will used for make sure client update all assets file cached,
  // when we deploy new version.
  app.locals.deployTime = (new Date()).getTime();

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
}

/**
* Initialize the Express application
* [NOTICE] Please keep corect order of all steps below.
*/
module.exports.init = function (db) {
  let app = express();

  // 1. Setup routes
  app.use(require('../../app/routes'));

  // 2. Setup middlewares
  require('./middleware')(app, db);

  // 3. Setup static content
  app.use('/', express.static('./public'));

  // 4. Setup local variables for express.
  initLocalVariables(app);

  // 5. Setup view engine
  require('./views')(app, db);

  // 6. Setup sessions
  require('./session')(app, db);

  // 7. Configure Socket.io
  app = require('./socket.io')(app, db);

  return app;
};
