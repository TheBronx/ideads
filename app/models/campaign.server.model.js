'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Campaign Schema
 */
var CampaignSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	active: {
		type: Boolean,
		default: true
	},
	includedPlaces: [{ type: Schema.ObjectId, ref: 'Place' }],
	ads: [{ type: Schema.ObjectId, ref: 'Ad' }],
	owner: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'Owner cannot be blank'
	}
});

mongoose.model('Campaign', CampaignSchema);
