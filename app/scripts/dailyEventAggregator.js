'use strict';


var mongoose = require('mongoose'),
	db = mongoose.connect('mongodb://localhost/mean');

require('../models/event.server.model.js');
require('../models/stats.server.model.js');

var Event = mongoose.model('Event'),
    Stats = mongoose.model('Stats');


function getBaseDay(timestamp) {
	return (timestamp - timestamp%(24*3600*1000));
}

function getAdStats(stats, adId) {
	for (var i=0; i<stats.ads.length; i++) {
		if ( adId.toString() === stats.ads[i].ad ) {
			return stats.ads[i];
		}
	}

	stats.ads.push({
		'ad': adId.toString(),
		'views': 0,
		'clicks': 0
	});
	return stats.ads[i];
}

function aggregateDay(baseDay) {
	var stats = {
		'day': baseDay,
		'totals': {
			'views': 0,
			'clicks': 0
		},
		'ads': []
	};

	var until = baseDay + 24 * 60 * 60 * 1000 - 1; //1ms antes del siguiente dia

	Event.find({'date': {$gt: baseDay, $lt: until}}).sort('-date').exec(function(err, events) {

		if (err) {
			console.log(err);
		} else {

			var event;
			var adStats;
			for(var i=0; i<events.length; i++) {
				//use Timestamps instead of Dates (highcharts uses timestamps)
				events[i].date = events[i].date.getTime();
				event = events[i];

				//views and clicks
				if (event.type === 'view') {
					stats.totals.views++;
				} else if (event.type === 'click') {
					stats.totals.clicks++;
				}

				//total views and clicks per ad
				adStats = getAdStats(stats, event.ad);
				if (event.type === 'view') {
					adStats.views++;
				} else if (event.type === 'click') {
					adStats.clicks++;
				}
			}

			//save
			var statsObject = new Stats( {
				'day': baseDay,
				'totals': stats.totals,
				'ads': stats.ads
			});
			statsObject.save(function(err) {
				if (err) {
					console.log(err);
				}

				var date = new Date();
				date.setTime(baseDay);
				console.log('stats for day ' + date + ' saved');

				process.exit();
			});
		}
	});
}


var args = process.argv.slice(2);
var DIAS = args[0] || 1; //por defecto se guardaran los stats de hace 1 dia (de ayer vamos)
var day = getBaseDay(new Date().getTime() - DIAS * 24*60*60*1000);
aggregateDay(day);
