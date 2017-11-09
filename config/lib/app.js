
const port = 3000;

app.listen(port, function(err) {
  if(err) {
    console.error('Something error !!');
    console.error(err);
  }

  console.log('App listen on port ' + port);
});


'use strict';

/**
* Module dependencies.
*/
var config = require('../config'),
mongoose = require('./mongoose'),
express = require('./express');

module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
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
    // Start the app by listening on <port>
    app.listen(port , function () {
      console.log('-------------- QChat Application ---------------');
      console.log('App Starting On Port ' + port);
      console.log('Environment: ' + process.env.NODE_ENV || 'production');
      console.log('-----------------------------------');
      if (callback) callback(app, db, config);
    });
  });
};
