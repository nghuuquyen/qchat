'use strict';

module.exports = function(io, socket) {
  require('./chat.server.socket')(io, socket);
};
