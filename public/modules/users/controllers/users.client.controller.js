'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
	function($scope, $stateParams, $location, Authentication, Users) {

		$scope.find = function() {
			$scope.users = Users.query();
		};

		$scope.findOne = function() {
			$scope.user = Users.get({
				userId: $stateParams.userId
			});
		};
	}
]);
