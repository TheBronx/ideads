'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	events = require('../../app/controllers/events');

module.exports = function(app) {
	// Events Routes
	app.route('/stats')
		.get(events.list, users.requiresLogin);

	app.route('/stats/since-:date')
		.get(events.listBetween, users.requiresLogin);

	app.route('/stats/since-:since/until-:until')
		.get(events.listBetween, users.requiresLogin);

	// Finish by binding the since/until middleware
	app.param('since', events.since);
	app.param('until', events.until);
};
