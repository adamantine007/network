(function () {
  'use strict';

  angular
    .module('interests')
    .controller('InterestsListController', InterestsListController);

  InterestsListController.$inject = ['InterestsService'];

  function InterestsListController(InterestsService) {
    var vm = this;

    vm.interests = InterestsService.query();
  }
})();
