'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ad Schema
 */
var AdSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		trim: true,
		required: 'Name cannot be blank'
	},
	image: {
		type: String,
		trim: false
	},
	content: {
		type: String,
		default: '',
		trim: false,
		required: 'HTML content cannot be blank'
	},
	link: {
		type: String,
		default: '',
		trim: false,
		required: 'Link cannot be blank'
	},
	width: {
		type: Number,
		default: 728,
		required: 'Width cannot be blank'
	},
	height: {
		type: Number,
		default: 90,
		required: 'Height cannot be blank'
	},
	campaign: {
		type: Schema.ObjectId,
		ref: 'Campaign'
	},
	enabled: {
		type: Boolean,
		default: true
	},
	clicks: {
		type: Number,
		default: 0
	},
	views: {
		type: Number,
		default: 0
	}
});

mongoose.model('Ad', AdSchema);
