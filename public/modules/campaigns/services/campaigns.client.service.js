'use strict';

//Campaigns service used for communicating with the places REST endpoints
angular.module('campaigns').factory('Campaigns', ['$resource',
	function($resource) {
		return $resource('campaigns/:campaignId', {
			campaignId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
