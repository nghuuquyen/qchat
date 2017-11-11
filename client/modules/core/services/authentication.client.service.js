'use strict';

// Authentication service for user variables
angular.module('core').factory('Authentication', [
  function() {
    var _this = this;

    _this._data = {
      user: angular.copy(window.user),
      getUser : function() {
        return _this._data.user;
      }
    };

    return _this._data;
  }
]);
