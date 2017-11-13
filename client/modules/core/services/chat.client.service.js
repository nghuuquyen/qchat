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
    return {

    };
  }
})();
