'use strict';

/**
* Module dependencies.
*/
var config = require('../config'),
mongoose = require('mongoose');

// mpromise (mongoose's default promise library) is deprecated,
// Plug-in your own promise library instead.
// Use native promises or bluebird
mongoose.Promise = require('bluebird');

// Initialize Mongoose
module.exports.connect = function (cb) {
  var _this = this;

  var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    // Log Error
    if (err) {
      console.error('Could not connect to MongoDB!');
      console.log(err);
    } else {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);

      // Call callback FN
      if (cb) cb(db);
    }
  });
};

module.exports.disconnect = function (cb) {
  mongoose.disconnect(function (err) {
    console.info('Disconnected from MongoDB.');
    cb(err);
  });
};
