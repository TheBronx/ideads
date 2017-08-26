'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		//logged in users should see the dashboard instead of the public index
		if ($scope.authentication.user !== null) {
			$location.path('/dashboard');
		}
	}
]);
