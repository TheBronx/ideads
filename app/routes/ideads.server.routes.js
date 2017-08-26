'use strict';

/**
 * Module dependencies.
 */
var ideads = require('../../app/controllers/ideads'),
	places = require('../../app/controllers/places'),
	ads = require('../../app/controllers/ads');

module.exports = function(app) {
	// Ideads Routes
	app.route('/ideads/:placeId').get(ideads.serve);
	app.route('/ideads/:placeId/click/:adId').get(ideads.click);

	// Finish by binding the places middleware
	app.param('placeId', places.placeByID);
	app.param('adId', ads.adByID);
};
