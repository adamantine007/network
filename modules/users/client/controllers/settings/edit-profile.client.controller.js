'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'ProfessionsService', 'InterestsService',
  function ($scope, $http, $location, Users, Authentication, Professions, Interests) {
    $scope.user = Authentication.user;

    $scope.form = {};

    $scope.professions = Professions.query(function (result) {
      $scope.form.selectedProfessions = [];
      for(var i = 0; i < result.length; i++) {
        for(var j = 0; j < $scope.user.professions.length; j++) {
          if($scope.user.professions[j] === result[i]._id) {
            $scope.form.selectedProfessions.push(result[i]);
          }
        }
      }
    });

    // var map = new GMaps({
    //   el: '#map',
    //   lat: -12.043333,
    //   lng: -77.028333
    // });

    $scope.interests = Interests.query(function (result) {
      $scope.form.selectedInterests = [];
      for(var i = 0; i < result.length; i++) {
        for(var j = 0; j < $scope.user.interests.length; j++) {
          if($scope.user.interests[j] === result[i]._id) {
            $scope.form.selectedInterests.push(result[i]);
          }
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
      console.log('user.inters: ', user.interests);
      console.log('selectedProfs: ', $scope.form.selectedProfessions);
      console.log('selectedInters: ', $scope.form.selectedInterests);

      user.professions = [];
      for(var i = 0; i < $scope.form.selectedProfessions.length; i++) {
        user.professions.push($scope.form.selectedProfessions[i]);
      }

      user.interests = [];
      for(var j = 0; j < $scope.form.selectedInterests.length; j++) {
        user.interests.push($scope.form.selectedInterests[j]);
      }

      
      console.log(user);

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
