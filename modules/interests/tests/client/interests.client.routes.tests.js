(function () {
  'use strict';

  describe('Interests Route Tests', function () {
    // Initialize global variables
    var $scope,
      InterestsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InterestsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InterestsService = _InterestsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('interests');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/interests');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          InterestsController,
          mockInterest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('interests.view');
          $templateCache.put('modules/interests/client/views/view-interest.client.view.html', '');

          // create mock Interest
          mockInterest = new InterestsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Interest Name'
          });

          //Initialize Controller
          InterestsController = $controller('InterestsController as vm', {
            $scope: $scope,
            interestResolve: mockInterest
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:interestId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.interestResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            interestId: 1
          })).toEqual('/interests/1');
        }));

        it('should attach an Interest to the controller scope', function () {
          expect($scope.vm.interest._id).toBe(mockInterest._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/interests/client/views/view-interest.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InterestsController,
          mockInterest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('interests.create');
          $templateCache.put('modules/interests/client/views/form-interest.client.view.html', '');

          // create mock Interest
          mockInterest = new InterestsService();

          //Initialize Controller
          InterestsController = $controller('InterestsController as vm', {
            $scope: $scope,
            interestResolve: mockInterest
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.interestResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/interests/create');
        }));

        it('should attach an Interest to the controller scope', function () {
          expect($scope.vm.interest._id).toBe(mockInterest._id);
          expect($scope.vm.interest._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/interests/client/views/form-interest.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InterestsController,
          mockInterest;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('interests.edit');
          $templateCache.put('modules/interests/client/views/form-interest.client.view.html', '');

          // create mock Interest
          mockInterest = new InterestsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Interest Name'
          });

          //Initialize Controller
          InterestsController = $controller('InterestsController as vm', {
            $scope: $scope,
            interestResolve: mockInterest
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:interestId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.interestResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            interestId: 1
          })).toEqual('/interests/1/edit');
        }));

        it('should attach an Interest to the controller scope', function () {
          expect($scope.vm.interest._id).toBe(mockInterest._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/interests/client/views/form-interest.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
