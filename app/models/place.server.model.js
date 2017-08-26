'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Place Schema
 */
var PlaceSchema = new Schema({
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
	width: {
		type: Number,
		default: 728,
		required: 'Width cannot be blank'
	},
	height: {
		type: Number,
		default: 90,
		required: 'Height cannot be blank'
	}
});

mongoose.model('Place', PlaceSchema);
