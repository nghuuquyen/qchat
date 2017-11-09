'use strict';

var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      level: 'debug',
      json: true,
      filename: '.temp/logs/debug.log',
      handleExceptions: true
    }),
    new (winston.transports.Console)({
      level: 'debug',
      json: false,
      handleExceptions: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
