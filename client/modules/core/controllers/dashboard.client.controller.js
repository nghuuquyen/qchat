(function() {
  'use strict';

  angular
  .module('core')
  .controller('DashboardController', Controller);

  Controller.$inject = ['ChatService'];

  /* @ngInject */
  function Controller(ChatService) {
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
