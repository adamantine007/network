(function () {
  'use strict';

  angular
    .module('professions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Professions',
      state: 'professions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'professions', {
      title: 'List Professions',
      state: 'professions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'professions', {
      title: 'Create Profession',
      state: 'professions.create',
      roles: ['user']
    });
  }
})();
