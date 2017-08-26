'use strict';

// Setting up route
angular.module('ads').config(['$stateProvider',
	function($stateProvider) {
		// Ads state routing
		$stateProvider.
		state('listAds', {
			url: '/ads',
			templateUrl: 'modules/ads/views/list-ads.client.view.html'
		}).
		state('createAd', {
			url: '/ads/create',
			templateUrl: 'modules/ads/views/create-ad.client.view.html'
		}).
		state('viewAd', {
			url: '/ads/:adId',
			templateUrl: 'modules/ads/views/view-ad.client.view.html'
		}).
		state('editAd', {
			url: '/ads/:adId/edit',
			templateUrl: 'modules/ads/views/edit-ad.client.view.html'
		});
	}
]);
