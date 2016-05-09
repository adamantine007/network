(function () {
  'use strict';

  angular
    .module('interests')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Interests',
      state: 'interests',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'interests', {
      title: 'List Interests',
      state: 'interests.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'interests', {
      title: 'Create Interest',
      state: 'interests.create',
      roles: ['user']
    });
  }
})();
