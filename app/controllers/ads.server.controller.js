'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Ad = mongoose.model('Ad'),
	Campaign = mongoose.model('Campaign'),
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
				message = 'Ad already exists';
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

function generateContentFromImage(image) {
	var content;
	if (image !== undefined && image !== '') {
		content = '<img src="{{image}}" />';
	}

	return content;
}

/**
 * Create an Ad
 */
exports.create = function(req, res) {
	//replace campaign object with its mongodb ID
	req.body.campaign = req.body.campaign._id;

	//handle content
	if (req.body.content === undefined || req.body.content === '') {
		req.body.content = generateContentFromImage(req.body.image);
	}

	var ad = new Ad(req.body);

	ad.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ad);
		}
	});

	//add this Ad to its Campaign
	Campaign.findById(ad.campaign).populate('ads').exec(function(err, campaign) {
		if (err) console.err(err);
		if (!campaign) console.err('Failed to load campaign ' + ad.campaign);
		campaign.ads.push(ad._id);
		campaign.save(function(err) {
			if (err) {
				console.err('ERROR: Campaign '+campaign._id+' not updated');
			}
		});
	});
};

/**
 * Show the current Ad
 */
exports.read = function(req, res) {
	res.jsonp(req.ad);
};

/**
 * Update an Ad
 */
exports.update = function(req, res) {
	var ad = req.ad;

	ad = _.extend(ad, req.body);

	ad.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ad);
		}
	});

	//TODO update campaign
	//si un anuncio cambia de campaña, hay que actualizar campaign.ads (tanto en la antigua como en la nueva)
};

/**
 * Delete an Ad
 */
exports.delete = function(req, res) {
	var ad = req.ad;

	ad.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ad);
		}
	});

	//TODO update campaign
};

/**
 * List of Ads
 */
exports.list = function(req, res) {
	Ad.find().sort('-created').populate('campaign', 'name').exec(function(err, ads) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ads);
		}
	});
};

/**
 * Ads middleware
 */
exports.adByID = function(req, res, next, id) {
	Ad.findById(id).populate('campaign', 'name').exec(function(err, ad) {
		if (err) return next(err);
		if (!ad) return next(new Error('Failed to load ad ' + id));
		req.ad = ad;
		next();
	});
};

/**
 * Ad authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.roles.indexOf('admin') === -1) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};
