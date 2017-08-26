'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var adsSchema = mongoose.Schema({
	ad: {
		type: String
	},
	views: {
		type: Number
	},
	clicks: {
		type: Number
	}
},{ _id : false });


var StatsSchema = new Schema({
	day: {
		type: Number
	},
	totals: {
		views: Number,
		clicks: Number
	},
	ads: [adsSchema]
});

mongoose.model('Stats', StatsSchema);
