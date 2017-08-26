'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	ads = require('../../app/controllers/ads');

module.exports = function(app) {
	// Ads Routes
	app.route('/ads')
		.get(ads.list)
		.post(users.requiresLogin, ads.hasAuthorization, ads.create);

	app.route('/ads/:adId')
		.get(ads.read)
		.put(users.requiresLogin, ads.hasAuthorization, ads.update)
		.delete(users.requiresLogin, ads.hasAuthorization, ads.delete);

	// Finish by binding the ad middleware
	app.param('adId', ads.adByID);
};
