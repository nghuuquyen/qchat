/**
* Created by Quyen Nguyen Huu on 12/11/2017.
* Email : nghuuquyen@gmail.com
*/
(function() {
  'use strict';

  angular
  .module('core')
  .controller('ChatRoomController', Controller);

  Controller.$inject = ['$scope', 'Authentication', 'Socket', 'ChatService', 'room'];

  /* @ngInject */
  function Controller($scope, Authentication, Socket, ChatService, room) {
    var vm = this;
    vm.loggedUser = Authentication.user;
    vm.sendMessage = sendMessage;

    activate();

    function activate() {
      vm.room = room;
      vm.room.connections = [];

      Socket.connect('/chatroom');

      Socket.on('connect', function() {
        Socket.emit('join', { code : room.code });

        // Push current logger user to list connections.
        vm.room.connections.push(Authentication.user);
      });

      Socket.on('has-new-member', function(data) {
        data.connections.forEach(function(item) {
          // Only push if user not exits
          if(findConnectionUser(item.user.username) === -1) {
            vm.room.connections.push(item.user);
          }
        });
      });

      Socket.on('user-logout', function(data) {
        var _index = findConnectionUser(data.user.username);
        if(_index === -1) return;

        vm.room.connections.splice(_index, 1);
      });

      Socket.on('message', function(message) {
        vm.room.messages.push(message);
      });
    }

    function findConnectionUser(username) {
      return vm.room.connections.findIndex(function(conn) {
        return conn.username === username;
      });
    }

    function sendMessage($valid) {
      if(!$valid) return;

      var _data = {
        code : room.code,
        message : {
          author : Authentication.user,
          createdAt : new Date(),
          content : vm.message
        }
      };

      vm.room.messages.push(_data.message);
      Socket.emit('message', _data);
    }

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('has-new-member');
      Socket.removeListener('message');
    });
  }
})();
