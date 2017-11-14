/**
* Created by Quyen Nguyen Huu on 12/11/2017.
* Email : nghuuquyen@gmail.com
*/
(function() {
  'use strict';

  angular
  .module('core')
  .controller('ChatRoomController', Controller);

  Controller.$inject = ['$scope', 'Authentication', 'ChatService', 'room'];

  /* @ngInject */
  function Controller($scope, Authentication, ChatService, room) {
    var vm = this;

    activate();

    function activate() {
      vm.room = room;
    }
  }
})();
