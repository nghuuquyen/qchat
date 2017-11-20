(function() {
  'use strict';

  angular
  .module('core')
  .controller('RoomModalController', Controller);

  Controller.$inject = ['close', 'ChatService'];

  /* @ngInject */
  function Controller(close, ChatService) {
    var vm = this;

    // Public methods
    vm.createRoom = createRoom;
    vm.joinRoom = joinRoom;
    vm.close = closeModal;

    // Public models
    vm.room = {
      name : '',
      password : '',
      confirmPassword : ''
    };

    function createRoom() {
      if(vm.room.password !== vm.room.confirmPassword) {
        alert('Password not match !!');
        return;
      }

      ChatService.createRoom(vm.room).then(function(newRoom) {
        close(newRoom, 500);
      })
      .catch(function(err) {
        alert(err.message || err.data.message);
      });
    }

    function joinRoom() {
      if(!vm.room.code || !vm.room.password) {
        alert('Please enter room code and password !!');
        return;
      }

      ChatService.joinRoom(vm.room.code, vm.room.password)
      .then(function(room) {
        close(room, 500);
      })
      .catch(function(err) {
        alert(err.message || err.data.message);
      });
    }

    function closeModal() {
      close(null, 500);
    }
  }
})();
