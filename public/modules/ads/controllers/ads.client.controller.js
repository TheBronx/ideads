'use strict';

angular.module('ads').controller('AdsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ads',
	function($scope, $stateParams, $location, Authentication, Ads) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var ad = new Ads({
				name: this.name,
				campaign: this.campaign,
				image: this.image,
				content: this.content,
				link: this.link,
				width: this.width,
				height: this.height
			});
			ad.$save(function(response) {
				$location.path('ads/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.name = '';
			this.campaign = undefined;
			this.image = '';
			this.content = '';
			this.link = '';
			this.width = 728;
			this.height = 90;
		};

		$scope.setImageData = function(fileContent) {
			if ($scope.ad !== undefined) {
				$scope.ad.image = fileContent;
			} else {
				this.image = fileContent;
			}
		};

		$scope.remove = function(ad) {
			if (ad) {
				ad.$remove();

				for (var i in $scope.ads) {
					if ($scope.ads[i] === ad) {
						$scope.ads.splice(i, 1);
					}
				}
			} else {
				$scope.ad.$remove(function() {
					$location.path('ads');
				});
			}
		};

		$scope.update = function() {
			var ad = $scope.ad;

			ad.$update(function() {
				$location.path('ads/' + ad._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.ads = Ads.query();
		};

		$scope.findOne = function() {
			$scope.ad = Ads.get({
				adId: $stateParams.adId
			});
		};

		$scope.exampleAdsenseContent = function() {
			$scope.image = '';
			$scope.link = 'adsense';
			$scope.content = '[adsense]<!--'+'\n'+
				'google_ad_client = "ca-pub-000000000000000000";'+'\n'+
				'/* AdSense Example */'+'\n'+
				'google_ad_slot = "0000000000";'+'\n'+
				'google_ad_width = 728;'+'\n'+
				'google_ad_height = 90;'+'\n'+
				'//-->'+'\n'+
				'var script = document.createElement(\'script\');'+'\n'+
				'script.type = \'text/javascript\';'+'\n'+
				'script.src = \'http://pagead2.googlesyndication.com/pagead/show_ads.js\';'+'\n'+
				'document.body.appendChild(script);'+'\n'+
				'[/adsense]';
		};
	}
]);
