/**
* Created by Quyen Nguyen Huu on 12/11/2017.
* Email : nghuuquyen@gmail.com
*/
(function() {
  'use strict';

  angular
  .module('core')
  .controller('ChatRoomController', Controller);

  Controller.$inject = ['$scope' ,'$log', 'Authentication', 'Socket', 'ChatService', 'room'];

  /* @ngInject */
  function Controller($scope, $log, Authentication, Socket, ChatService, room) {
    var vm = this;

    activate();

    function activate() {
      vm.room = room;
      Socket.connect('/chatroom');

      Socket.on('connect', function() {
        $log.info('Ok:: Connect to socket server.');
        Socket.emit('join', { code : room.code });

        Socket.emit('message', {
          code : room.code,
          message : {
            content : 'Hello world !!!',
            author : Authentication.user.id
          }
        });
      });

      Socket.on('has-new-member', function(data) {
        $log.info(data);
      });

      Socket.on('message', function(data) {
        $log.info(data);
      });
    }

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('has-new-member');
      Socket.removeListener('message');
    });
  }
})();
