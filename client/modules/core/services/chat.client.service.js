/**
* Created by Quyen Nguyen Huu on 12/11/2017.
* Email : nghuuquyen@gmail.com
*/
(function() {
  'use strict';

  angular
  .module('core')
  .factory('ChatService', Service);

  Service.$inject = ['$resource'];

  /* @ngInject */
  function Service($resource) {

    function getRoomByCode(code) {
      return $resource('/api/room/:roomCode', {
        roomCode : code
      })
      .get().$promise;
    }

    function getRoomData(code) {
      return $resource('/api/secure/room/:roomCode', {
        roomCode : code
      })
      .get().$promise;
    }

    function getRoomMessages(code, pageNumber) {
      return $resource('/api/secure/room/:roomCode/messages/:page', {
        roomCode : code,
        page : pageNumber
      })
      .query().$promise;
    }

    function joinRoom(code, password) {
      return $resource('/api/secure/room/:roomCode', {
        roomCode : code
      }).save({
        password : password
      }).$promise;
    }

    function getUserRooms() {
      return $resource('/api/secure/room').query().$promise;
    }

    function createRoom(data) {
      return $resource('/api/secure/room').save(data).$promise;
    }

    return {
      getRoomByCode : getRoomByCode,
      getRoomData : getRoomData,
      getRoomMessages : getRoomMessages,
      joinRoom : joinRoom,
      createRoom : createRoom,
      getUserRooms : getUserRooms
    };
  }
})();
