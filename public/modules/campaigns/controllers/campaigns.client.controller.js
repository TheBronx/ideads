'use strict';

angular.module('campaigns').controller('CampaignsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Campaigns',
	function($scope, $stateParams, $location, Authentication, Campaigns) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var campaign = new Campaigns({
				name: this.name,
				ads: this.ads,
				includedPlaces: this.includedPlaces,
				owner: this.owner,
				active: true
			});
			campaign.$save(function(response) {
				$location.path('campaigns/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.name = '';
			this.ads = [];
			this.includedPlaces = [];
			this.owner = undefined;
		};

		$scope.remove = function(campaign) {
			if (campaign) {
				campaign.$remove();

				for (var i in $scope.places) {
					if ($scope.campaigns[i] === campaign) {
						$scope.campaigns.splice(i, 1);
					}
				}
			} else {
				$scope.campaign.$remove(function() {
					$location.path('campaigns');
				});
			}
		};

		$scope.update = function() {
			var campaign = $scope.campaign;

			campaign.$update(function() {
				$location.path('campaigns/' + campaign._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.campaigns = Campaigns.query();
		};

		$scope.findOne = function() {
			Campaigns.get({
				campaignId: $stateParams.campaignId
			}).$promise.then(function(c) {
				var includedPlacesAsObjects = [];
				c.includedPlaces.forEach(function(placeId) {
					includedPlacesAsObjects.push({
						_id: placeId
					});
				});
				c.includedPlaces = includedPlacesAsObjects;
				$scope.campaign = c;
			});
		};
	}
]);
