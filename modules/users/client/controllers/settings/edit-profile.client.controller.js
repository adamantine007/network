'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'ProfessionsService', 'InterestsService',
  function ($scope, $http, $location, Users, Authentication, Professions, Interests) {
    $scope.user = Authentication.user;

    $scope.professions = Professions.query(function (result) {
      for(var i = 0; i < result.length; i++) {
        if(result[i]._id === $scope.user.professions[0]) {
          $scope.user.professions = result[i];
          break;
        }
      }
    });

    $scope.interests = Interests.query(function (result) {
      for(var i = 0; i < result.length; i++) {
        if(result[i]._id === $scope.user.interests[0]) {
          $scope.user.interests = result[i];
          break;
        }
      }
    });

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);
      console.log(user);
      console.log('user.profs: ', user.professions);
      console.log('user.inters: ',  user.interests);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);
