/**
* Created by Quyen Nguyen Huu on 14/11/2017.
* Email : nghuuquyen@gmail.com
*/
(function() {
  'use strict';

  angular
  .module('core')
  .controller('RoomController', Controller);

  Controller.$inject = ['$scope', 'Authentication', 'ChatService'];

  /* @ngInject */
  function Controller($scope, Authentication, ChatService) {
    var vm = this;
    
    activate();

    function activate() {
      // Get all joned rooms of logged user.
      ChatService.getUserRooms().then(function(rooms) {
        vm.rooms = rooms;
      });
    }
  }
})();
