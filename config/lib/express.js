"use strict";

const express = require('express');
const hbs = require('express-hbs');


/**
* Initialize the Express application
*/
module.exports.init = function (db) {
  const app = express();

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

  return app;
};
