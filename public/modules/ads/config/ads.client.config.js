'use strict';

// Configuring the Ads module
angular.module('ads').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Ads', 'ads', 'dropdown', '/ads(/create)?', undefined, false, ['admin']);
		Menus.addSubMenuItem('topbar', 'ads', 'List Ads', 'ads');
		Menus.addSubMenuItem('topbar', 'ads', 'New Ad', 'ads/create');
	}
]);
