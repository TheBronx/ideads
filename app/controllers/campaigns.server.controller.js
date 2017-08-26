'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Campaign = mongoose.model('Campaign'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	console.dir(err);
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Campaign already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else if (err.message) {
		message = err.message;
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Campaign
 */
exports.create = function(req, res) {
	/**
	 * CARE! funny shit:
	 * I've had to replace req.body contents to contain only ObjectIds
	 * if you just leave the array of Places, or the User as owner
	 * then the "new Campaign(req.body)" line will throw cast errors.
	 * AND you can't set those parts after calling "new". That's the funny part.
	 */
	//cast the array of places to an array of ObjectIds of places (mongoose wants ObjectIds)
	var placesAsObjectIds = [];
	req.body.includedPlaces.forEach( function (place){
		placesAsObjectIds.push(place._id);
	});
	req.body.includedPlaces = placesAsObjectIds;
	//TODO ads
	req.body.ads = [];
	//owner id
	req.body.owner = req.body.owner._id;

	var campaign = new Campaign(req.body);

	campaign.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(campaign);
		}
	});
};

/**
 * Show the current Campaign
 */
exports.read = function(req, res) {
	res.jsonp(req.campaign);
};

/**
 * Update a Campaign
 */
exports.update = function(req, res) {
	//cast places and owner to ObjectIds
	var placesAsObjectIds = [];
	req.body.includedPlaces.forEach( function (place){
		placesAsObjectIds.push(place._id);
	});
	req.body.includedPlaces = placesAsObjectIds;
	req.body.owner = req.body.owner._id;

	//update campaign
	var campaign = req.campaign;

	campaign = _.extend(campaign, req.body);

	campaign.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(campaign);
		}
	});
};

/**
 * Delete a Campaign
 */
exports.delete = function(req, res) {
	var campaign = req.campaign;

	campaign.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(campaign);
		}
	});
};

/**
 * List of Campaigns
 */
exports.list = function(req, res) {
	Campaign.find().sort('-name').populate('owner', 'displayName').exec(function(err, campaigns) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(campaigns);
		}
	});
};

/**
 * Campaign middleware
 */
exports.campaignByID = function(req, res, next, id) {
	Campaign.findById(id).populate('owner', 'displayName').exec(function(err, campaign) {
		if (err) return next(err);
		if (!campaign) return next(new Error('Failed to load campaign ' + id));
		req.campaign = campaign;
		next();
	});
};

/**
 * Campaign authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.roles.indexOf('admin') === -1) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};
