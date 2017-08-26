'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
	date: {
		type: Date,
		default: Date.now
	},
	type: {
		type: String,
		trim: true,
		required: 'Event type cannot be blank'
	},
	ad: {
		type: Schema.ObjectId,
		ref: 'Ad'
	},
	campaign: {
		type: Schema.ObjectId,
		ref: 'Campaign'
	}
});

mongoose.model('Event', EventSchema);
