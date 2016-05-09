//Interests service used to communicate Interests REST endpoints
(function () {
  'use strict';

  angular
    .module('interests')
    .factory('InterestsService', InterestsService);

  InterestsService.$inject = ['$resource'];

  function InterestsService($resource) {
    return $resource('api/interests/:interestId', {
      interestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
