"use strict";

const config = require('../config');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/**
* @name initSession
* @description
* Setup saving session to mongodb.
*
* @param  {object} app express instance
* @param  {object} db  mongoose instance
* @return {object}     session middleware config
*/
function initSession(app, db) {
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

  // Passport's middleware.
  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = initSession;
