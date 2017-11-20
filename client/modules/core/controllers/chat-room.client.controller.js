/**
* Created by Quyen Nguyen Huu on 12/11/2017.
* Email : nghuuquyen@gmail.com
*/
(function() {
  'use strict';

  angular
  .module('core')
  .controller('ChatRoomController', Controller);

  Controller.$inject = ['$scope', 'Authentication', 'Socket', 'ChatService',
  'room', '$timeout'];

  /* @ngInject */
  function Controller($scope, Authentication, Socket, ChatService, room, $timeout) {
    var vm = this;
    vm.loggedUser = Authentication.user;
    vm.sendMessage = sendMessage;

    activate();

    function activate() {
      vm.room = room;

      Socket.connect('/chatroom');

      Socket.on('connect', function() {
        Socket.emit('join', { code : room.code });

        updateListConnections(vm.room.connections);
        scrollToLastedMessage();
      });

      Socket.on('has-new-member', function(data) {
        updateListConnections(data.connections);
      });

      Socket.on('member-logout', function(data) {
        updateListConnections(data.connections);
      });

      Socket.on('message', function(message) {
        vm.room.messages.push(message);
        scrollToLastedMessage();
      });
    }

    function updateListConnections(connections) {
      vm.room.joined.forEach(function(user) {
        var _index = connections.findIndex(function(item) {
          return user._id === item.user._id;
        });

        user.isOnline = _index !== -1;
      });
    }

    function scrollToLastedMessage() {
      var _time = $timeout(function () {
        var chatMessages = angular.element('#chat-messages')[0];

        chatMessages.scrollTop = chatMessages.scrollHeight;
        $timeout.cancel(_time);
      }, 100);
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
      scrollToLastedMessage();
      Socket.emit('message', _data);

      // Reset form.
      vm.message = '';
    }

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('has-new-member');
      Socket.removeListener('member-logout');
      Socket.removeListener('message');
    });
  }
})();
