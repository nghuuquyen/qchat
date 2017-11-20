"use strict";

module.exports = {
  renderHomePage,
  isAuthenticated
};

/**
* @name renderHomePage
* @description
* Do render homepage.
*
* @param  {object}   req  HTTP Request
* @param  {object}   res  HTTP Response
* @param  {Function} next Next middleware
*/
function renderHomePage(req, res, next) {
  res.render('home', {
    user : req.user
  });
}

/**
* @name isAuthenticated
* @description
* Check if user still not logged will redirect to signin page.
*
* @param  {object}   req  HTTP Request
* @param  {object}   res  HTTP Response
* @param  {Function} next Next middleware
*/
function isAuthenticated(req, res, next) {
  // Check passport session.
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/signin');
}
