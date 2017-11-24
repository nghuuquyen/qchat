/**
* Created by Quyen Nguyen Huu on 12/11/2017.
* Email : nghuuquyen@gmail.com
*/
(function () {
  'use strict';

  // Setting up route
  angular.module('core').config(RoutesConfigs);

  RoutesConfigs.$inject = ['$stateProvider'];

  /* @ngInject */
  function RoutesConfigs($stateProvider) {
    var _baseUrl = 'client/modules/core/views';

    $stateProvider.state('chat', {
      url: '/u',
      views : {
        'chat-room@' : {
          templateUrl: _baseUrl + '/dashboard.client.view.html',
          controller : 'DashboardController',
          controllerAs : 'vm'
        },
        'sidebar-content@' : {
          templateUrl: _baseUrl + '/chat.sidebar.client.view.html',
          controller : 'RoomController',
          controllerAs : 'vm'
        }
      }
    })
    .state('chat.room', {
      url: '/room/{roomCode}',
      views : {
        'chat-room@' : {
          templateUrl: _baseUrl + '/chatbox.client.view.html',
          controller : 'ChatRoomController',
          controllerAs : 'vm'
        }
      },
      resolve : {
        room : getRoomData
      }
    });

    getRoomData.$inject = ['$stateParams','$window','$location','ChatService'];

    function getRoomData($stateParams, $window, $location, ChatService) {
      return ChatService.getRoomData($stateParams.roomCode)
      .then(function(room) {
        return room;
      })
      .catch(function() {
        $location.path('/u');
        $window.location.reload();
      });
    }
  }
}());
