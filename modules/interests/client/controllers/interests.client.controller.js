(function () {
  'use strict';

  // Interests controller
  angular
    .module('interests')
    .controller('InterestsController', InterestsController);

  InterestsController.$inject = ['$scope', '$state', 'Authentication', 'interestResolve'];

  function InterestsController ($scope, $state, Authentication, interest) {
    var vm = this;

    vm.authentication = Authentication;
    vm.interest = interest;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Interest
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.interest.$remove($state.go('interests.list'));
      }
    }

    // Save Interest
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.interestForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.interest._id) {
        vm.interest.$update(successCallback, errorCallback);
      } else {
        vm.interest.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('interests.view', {
          interestId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
