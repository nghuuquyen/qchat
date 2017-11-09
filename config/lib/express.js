"use strict";

const config = require('../config');
const express = require('express');
const hbs = require('express-hbs');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);

function initSession(app, db) {

  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure
    },
    name: config.sessionKey,
    store: new MongoStore({
      secret : config.sessionSecret,
      mongooseConnection : db
    })
  }));
}

/**
* Initialize the Express application
*/
module.exports.init = function (db) {
  let app = express();

  // Do Registration routes.
  app.use(require('../../app/routes'));

  // Set static content.
  app.use('/', express.static('./public'));


  // Set view template engine for file extension server.view.html
  app.engine('server.view.html', hbs.express4({
    extname: '.server.view.html'
  }));

  // Set view engine
  app.set('view engine', 'server.view.html');

  // Set views folder
  app.set('views', './app/views');

  // Initial sessions
  initSession(app, db);

  // Configure Socket.io
  app = require('./socket.io')(app, db);

  return app;
};
