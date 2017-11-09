'use strict';

/**
* Module dependencies.
*/

// loads environment variables from a .env file into process.env
const env = require('dotenv').config();
const config = require('./config');
const database = require('./database');
const express = require('./lib/express');

module.exports.init = function init(callback) {
  database.connect(function (db) {
    // Initialize express

    console.log('Connect Mongo Database Done.');
    var app = express.init(db);
    if (callback) callback(app, db, config);
  });
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, db, config) {
    var port = config.port || 3000;

    app.listen(port , function () {
      console.log('-------------- QChat Application ---------------');
      console.log('App Starting On Port ' + port);
      console.log('Environment: ' + process.env.NODE_ENV || 'production');
      console.log('-----------------------------------');
      if (callback) callback(app, db, config);
    });
  });
};
