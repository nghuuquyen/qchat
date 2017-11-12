"use strict";

module.exports = {
  renderHomePage : renderHomePage
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
