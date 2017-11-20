/**
* Created by Quyen Nguyen Huu on 14/11/2017.
* Email : nghuuquyen@gmail.com
*/
(function() {
  'use strict';

  angular
  .module('core')
  .controller('RoomController', Controller);

  Controller.$inject = ['$scope', 'Authentication', 'ChatService', 'ModalService'];

  /* @ngInject */
  function Controller($scope, Authentication, ChatService, ModalService) {
    var vm = this;

    // Public methods.
    vm.createNewRoom = createNewRoom;

    activate();

    function activate() {
      // Get all joned rooms of logged user.
      ChatService.getUserRooms().then(function(rooms) {
        vm.rooms = rooms;
      });
    }

    function createNewRoom() {
      ModalService.showModal({
        templateUrl: 'client/modules/core/views/create-room.client.view.html',
        controller: 'RoomModalController',
        controllerAs : 'vm',
        preClose: function(modal) {
          modal.element.modal('hide');
        }
      })
      .then(function(modal) {
        modal.element.modal();

        modal.close.then(function(newRoom) {
          if(!newRoom) return;

          vm.rooms.push(newRoom);
        });
      });
    }
  }
})();
