
'use strict';

/**
* Module dependencies
*/
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');
const logger = require('../../config/lib/logger');

const VIEWS = {
  SIGNIN_PAGE : 'pages/user/signin',
  SIGNUP_PAGE : 'pages/user/signup',
  CHAT_ROOMS  : 'pages/chat/rooms'
};

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

module.exports = {
  signup : signup,
  signin : signin,
  signout : signout,
  renderSignupPage : renderSignupPage,
  renderSigninPage : renderSigninPage
};

function renderSigninPage(req, res) {
  res.render(VIEWS.SIGNIN_PAGE, {
    messages : 'Flash messages here'
  });
}

function renderSignupPage(req, res) {
  res.render(VIEWS.SIGNUP_PAGE, {
    messages : 'Flash messages here'
  });
}

/**
* @name signup
* @description
* Handle signup user account.
*
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
function signup(req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function (err) {
    if (err) {
      logger.error(err);
      return res.status(422).render(VIEWS.SIGNUP_PAGE, {
        message: err.message
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          logger.error(err);
          res.status(400).render(VIEWS.SIGNUP_PAGE, {
            message: err.message
          });
        } else {
          res.render(VIEWS.CHAT_ROOMS, {
            user : user
          });
        }
      });
    }
  });
}

/**
* @name signin
* @description
* Handle signin user account.
*
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
function signin(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      logger.error(err);
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          logger.error(err);
          res.status(400).render(VIEWS.SIGNIN_PAGE, {
            message: err.message
          });
        } else {
          res.render(VIEWS.CHAT_ROOMS, {
            user : user
          });
        }
      });
    }
  })(req, res, next);
}

/**
* @name signout
* @description
* Handle signout user account.
*
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
function signout(req, res) {
  req.logout();
  res.redirect('/');
}
