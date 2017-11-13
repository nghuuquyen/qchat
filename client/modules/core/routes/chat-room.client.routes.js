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
      url: '/room'
    })
    .state('chat.room', {
      url: '/{roomCode}',
      views : {
        'chat-room@' : {
          templateUrl: _baseUrl + '/chatbox.client.view.html',
          controller : 'ChatRoomController',
          controllerAs : 'vm'
        }
      }
    });
  }
}());
