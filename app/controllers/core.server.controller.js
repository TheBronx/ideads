'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Campaign = mongoose.model('Campaign'),
	_ = require('lodash');

exports.index = function(req, res) {
	if (!req.user) {
		res.render('index', {
			user: req.user || null
		});
	} else {
		Campaign.find({'active': true, 'owner':req.user._id}).populate('ads').sort('-created').exec(function(err, campaigns) {
			if (err) {
				console.log(err);
				campaigns = [];
			}

			res.render('index', {
				user: req.user || null,
				data: {'campaigns': campaigns}
			});
		});
	}
};
