'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Place = mongoose.model('Place'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Place already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a place
 */
exports.create = function(req, res) {
	var place = new Place(req.body);

	place.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(place);
		}
	});
};

/**
 * Show the current place
 */
exports.read = function(req, res) {
	res.jsonp(req.place);
};

/**
 * Update a place
 */
exports.update = function(req, res) {
	var place = req.place;

	place = _.extend(place, req.body);

	place.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(place);
		}
	});
};

/**
 * Delete a place
 */
exports.delete = function(req, res) {
	var place = req.place;

	place.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(place);
		}
	});
};

/**
 * List of Places
 */
exports.list = function(req, res) {
	Place.find().sort('-created').exec(function(err, places) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(places);
		}
	});
};

/**
 * Place middleware
 */
exports.placeByID = function(req, res, next, id) {
	try {
		Place.findById(id).exec(function(err, place) {
			if (err) return next(err);
			if (!place) return next(new Error('Place ' + id + ' not found'));
			req.place = place;
			next();
		});
	} catch(err) {
		return next(new Error('Place ' + id + ' not found'));
	}
};

/**
 * Place authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.roles.indexOf('admin') === -1) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};
