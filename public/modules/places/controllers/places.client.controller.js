'use strict';

angular.module('places').controller('PlacesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Places',
	function($scope, $stateParams, $location, Authentication, Places) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var place = new Places({
				name: this.name,
				width: this.width,
				height: this.height
			});
			place.$save(function(response) {
				$location.path('places/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.name = '';
			this.width = '';
			this.height = '';
		};

		$scope.remove = function(place) {
			if (place) {
				place.$remove();

				for (var i in $scope.places) {
					if ($scope.places[i] === place) {
						$scope.places.splice(i, 1);
					}
				}
			} else {
				$scope.place.$remove(function() {
					$location.path('places');
				});
			}
		};

		$scope.update = function() {
			var place = $scope.place;

			place.$update(function() {
				$location.path('places/' + place._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.places = Places.query();
		};

		$scope.findOne = function() {
			$scope.place = Places.get({
				placeId: $stateParams.placeId
			});
		};
	}
]);
