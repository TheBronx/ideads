'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	campaigns = require('../../app/controllers/campaigns');

module.exports = function(app) {
	// Campaign Routes
	app.route('/campaigns')
		.get(campaigns.list)
		.post(users.requiresLogin, campaigns.hasAuthorization, campaigns.create);

	app.route('/campaigns/:campaignId')
		.get(campaigns.read)
		.put(users.requiresLogin, campaigns.hasAuthorization, campaigns.update)
		.delete(users.requiresLogin, campaigns.hasAuthorization, campaigns.delete);

	// Finish by binding the campaign middleware
	app.param('campaignId', campaigns.campaignByID);
};
