'use strict';

// Configuring the Campaigns module
angular.module('campaigns').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Campaigns', 'campaigns', 'dropdown', '/campaigns(/create)?', undefined, false, ['admin']);
		Menus.addSubMenuItem('topbar', 'campaigns', 'List Campaigns', 'campaigns');
		Menus.addSubMenuItem('topbar', 'campaigns', 'New Campaign', 'campaigns/create');
	}
]);
