'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Place = mongoose.model('Place'),
	Campaign = mongoose.model('Campaign'),
	Ad = mongoose.model('Ad'),
	Event = mongoose.model('Event'),
	_ = require('lodash');

function sanitize(ad) {
	//we dont want to show all information
	var sanitizedAd = ad;
	sanitizedAd.link = undefined;
	sanitizedAd.views = undefined;
	sanitizedAd.clicks = undefined;
	sanitizedAd.created = undefined;
	return sanitizedAd;
}

function haveSameDimension(place, ad) {
	if (place === undefined || ad === undefined)
		return false;
	if (place.width === undefined || place.height === undefined)
		return false;
	if (ad.width === undefined || ad.height === undefined)
		return false;

	return place.width === ad.width && place.height === ad.height;
}

/**
 * Serve ad for this place
 */
exports.serve = function(req, res) {
	var place = req.place;
	Campaign.find({'active': true}).where('includedPlaces').in([place._id]).populate('ads').exec(function(err, campaigns) {
		if (err) {
			return res.send(404, {
				message: err
			});
		} else {
			var ads = [];
			//for each campaign in campaigns, find active ads with this place's size
			campaigns.forEach(function (campaign) {
				campaign.ads.forEach(function(ad) {
					if (ad.enabled && haveSameDimension(place, ad)) {
						ads.push(ad);
					}
				});
			});

			//now, choose one of those ads, randomly and return it
			if (ads.length === 0) {
				return res.send(404, {
					message: 'No ads available'
				});
			}
			var randomIndex = Math.floor(Math.random() * ads.length);
			var ad = ads[randomIndex];
			//save stats (date, campaign, ad, event)
			//step 1: save event
			var event = new Event({'date': new Date(), 'type': 'view', 'campaign': ad.campaign, 'ad': ad._id });
			event.save(function(err) {
				if (err) {
					console.err('ERROR: ideads.serve - Event not saved');
				}
			});
			//step 2: save view counter
			ad.views++;
			ad.save(function(err) {
				if (err) {
					console.err('ERROR: ideads.serve - Ad views not saved');
				}

				res.jsonp(sanitize(ad));
			});
		}
	});
};

/**
 * Ad clicked
 */
exports.click = function(req, res) {
	var place = req.place;
	var ad = req.ad;

	place = _.extend(place, req.body);
	ad = _.extend(ad, req.body);

	//save stats (date, campaign, ad, event)
	//step 1: save event
	var event = new Event({'date': new Date(), 'type': 'click', 'campaign': ad.campaign, 'ad': ad._id });
	event.save(function(err) {
		if (err) {
			console.err('ERROR: ideads.serve - Event not saved');
		}
	});
	//step 2: save click counter
	ad.clicks++;
	ad.save(function(err) {
		if (err) {
			console.err('ERROR: ideads.click - Ad clicks not saved');
		}
		res.redirect(ad.link);
	});
};
