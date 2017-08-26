'use strict';

// Configuring the Places module
angular.module('places').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Places', 'places', 'dropdown', '/places(/create)?', undefined, false, ['admin']);
		Menus.addSubMenuItem('topbar', 'places', 'List Places', 'places');
		Menus.addSubMenuItem('topbar', 'places', 'New Place', 'places/create');
	}
]);
