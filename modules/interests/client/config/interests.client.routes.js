(function () {
  'use strict';

  angular
    .module('interests')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('interests', {
        abstract: true,
        url: '/interests',
        template: '<ui-view/>'
      })
      .state('interests.list', {
        url: '',
        templateUrl: 'modules/interests/client/views/list-interests.client.view.html',
        controller: 'InterestsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Interests List'
        }
      })
      .state('interests.create', {
        url: '/create',
        templateUrl: 'modules/interests/client/views/form-interest.client.view.html',
        controller: 'InterestsController',
        controllerAs: 'vm',
        resolve: {
          interestResolve: newInterest
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Interests Create'
        }
      })
      .state('interests.edit', {
        url: '/:interestId/edit',
        templateUrl: 'modules/interests/client/views/form-interest.client.view.html',
        controller: 'InterestsController',
        controllerAs: 'vm',
        resolve: {
          interestResolve: getInterest
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Interest {{ interestResolve.name }}'
        }
      })
      .state('interests.view', {
        url: '/:interestId',
        templateUrl: 'modules/interests/client/views/view-interest.client.view.html',
        controller: 'InterestsController',
        controllerAs: 'vm',
        resolve: {
          interestResolve: getInterest
        },
        data:{
          pageTitle: 'Interest {{ articleResolve.name }}'
        }
      });
  }

  getInterest.$inject = ['$stateParams', 'InterestsService'];

  function getInterest($stateParams, InterestsService) {
    return InterestsService.get({
      interestId: $stateParams.interestId
    }).$promise;
  }

  newInterest.$inject = ['InterestsService'];

  function newInterest(InterestsService) {
    return new InterestsService();
  }
})();
