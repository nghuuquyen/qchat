(function() {
  'use strict';

  angular
  .module('core')
  .controller('RoomModalController', Controller);

  Controller.$inject = ['close', 'ChatService'];

  /* @ngInject */
  function Controller(close, ChatService) {
    var vm = this;

    // Public models
    vm.room = {
      name : '',
      password : '',
      confirmPassword : ''
    };

    // Public methods
    vm.createRoom = createRoom;
    vm.close = closeModal;

    function createRoom() {
      if(vm.room.password !== vm.room.confirmPassword) {
        alert('Password not match !!');
        return;
      }

      ChatService.createRoom(vm.room).then(function(newRoom) {
        close(newRoom, 500);
      })
      .catch(function(err) {
        alert(err.message);
      });
    }

    function closeModal() {
      close(null, 500);
    }
  }
})();
