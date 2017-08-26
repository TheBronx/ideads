'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ad = mongoose.model('Ad'),
	Campaign = mongoose.model('Campaign'),
	Event = mongoose.model('Event'),
	Stats = mongoose.model('Stats'),
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
				message = 'Event already exists';
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

/**
 * Since date/until middleware
 */
function getBaseDay(timestamp) {
	return (timestamp - timestamp%(24*3600*1000));
}

function dayMonthYearToDate(day, month, year) {
	var date = new Date();
	date.setDate(day);
	date.setMonth(month - 1); //jan = 0
	date.setFullYear(year);
	date.setTime(getBaseDay(date.getTime())); //00h 00m 000ms
	return date;
}

var EventAgregator = function(campaignIds, since, until, callback) {
	var _this = this;
	this.campaigns = campaignIds;
	this.since = since; //timestamps
	this.until = until; //timestamps
	this.onFinish = callback;

	this.getBaseDay = function(timestamp) {
		return (timestamp - timestamp%(24*3600*1000));
	};

	this.getSeriesWithZeros = function(sinceTimestamp, untilTimestamp) {
		var serie = [];
		var day = sinceTimestamp;
		while(day <= untilTimestamp) {
			serie.push([day, 0]);
			day += 24*3600*1000;
		}
		return serie;
	};

	this.addSeriesEvent = function(serie, day) {
		//if day already exists, increment 1
		for(var i=0; i<serie.data.length; i++) {
			if(serie.data[i][0] > day) { //element is not going to be in the array, break
				break;
			}
			if(serie.data[i][0] === day) { //we are comparing timestamps, === works
				serie.data[i][1]++;
				return serie;
			}

		}
		//day not found, push it
		serie.data.push([day, 1]);

		return serie;
	};


	this.series = {
		'plot': [
			{
				'data': _this.getSeriesWithZeros(_this.since, _this.until)
			},
			{
				'data': _this.getSeriesWithZeros(_this.since, _this.until)
			}
		],
		'table': {}
	};


	this.agregate = function() {
		var day = _this.since;
		var nextDay = day + 24 * 60 * 60 * 1000;
		_this.agregateBetween(day, nextDay);
	};

	this.agregateBetween = function(sinceDay, untilDay) {
		Stats.find({'day': sinceDay}).sort('-day').exec(function(err, stats) {
			if (err) {
				_this.onFinish(err, undefined);
			} else {
				if (stats.length>0) {
					stats = stats[0];

					//stats found for this day
					//console.log('tenemos stats para el dia ' + sinceDay);
					//console.log(stats);

					//usemos esos stats
					var index = 0;
					for (var z=0; z<_this.series.plot[0].data.length; z++) {
						if (_this.series.plot[0].data[z][0] === sinceDay) {
							index = z;
							break;
						}
					}

					_this.series.plot[0].data[index] = [sinceDay, stats.totals.views]; //visualizaciones totales ese dia
					_this.series.plot[1].data[index] = [sinceDay, stats.totals.clicks]; //clicks totales ese dia

					//acumulado por cada anuncio
					var currentAd;
					for (var i=0; i<stats.ads.length; i++) {
						currentAd = stats.ads[i];

						if (_this.series.table[currentAd.ad] === undefined) {
							_this.series.table[currentAd.ad] = {'views': 0, 'clicks': 0};
						}

						_this.series.table[currentAd.ad].views += currentAd.views;
						_this.series.table[currentAd.ad].clicks += currentAd.clicks;
					}


					//call next time lapse
					sinceDay = untilDay;
					untilDay += 24 * 60 * 60 * 1000;
					if (sinceDay > _this.until) {
						//finished!
						_this.onFinish(undefined, _this.series);
					} else {
						//next day
						process.nextTick(function() {
							_this.agregateBetween(sinceDay, untilDay);
						});
					}
				} else {
					//stats not found, try to find and aggregate individual events...
					//console.log('tira de eventos');

					//get events between since and until
					Event.find({'date': {$gt: sinceDay, $lt: untilDay}}).where('campaign').in(_this.campaigns).sort('-date').exec(function(err, events) {

						if (err) {
							_this.onFinish(err, undefined);
						} else {

							var day;
							var event;
							for(var i=0; i<events.length; i++) {
								//use Timestamps instead of Dates (highcharts uses timestamps)
								events[i].date = events[i].date.getTime();
								event = events[i];

								//views and clicks series:
								if (event.type === 'view') {
									day = _this.getBaseDay(event.date);
									_this.series.plot[0] = _this.addSeriesEvent(_this.series.plot[0], day);
								} else if (event.type === 'click') {
									day = _this.getBaseDay(event.date);
									_this.series.plot[1] = _this.addSeriesEvent(_this.series.plot[1], day);
								}

								//total views and clicks per ad
								if (_this.series.table[event.ad] === undefined) {
									_this.series.table[event.ad] = {'views': 0, 'clicks': 0};
								}
								if (event.type === 'view') {
									_this.series.table[event.ad].views++;
								} else if (event.type === 'click') {
									_this.series.table[event.ad].clicks++;
								}
							}

							//call next time lapse
							sinceDay = untilDay;
							untilDay += 24 * 60 * 60 * 1000;
							if (sinceDay > _this.until) {
								//finished!
								_this.onFinish(undefined, _this.series);
							} else {
								//next day
								process.nextTick(function() {
									_this.agregateBetween(sinceDay, untilDay);
								});
							}

						}
					});
				}
			}
		});
	};

	_this.agregate();
};


/**
 * List of Events
 */
exports.list = function(req, res) {
	req.since = new Date();
	req.since.setTime(req.since.getTime() - 30 * 24 * 3600 * 1000); //30 days ago
	exports.listBetween(req, res);
};

/**
 * List of Events since one date
 */
exports.listBetween = function(req, res) {
	var since = req.since;
	if (since === undefined) {
		return res.send(400, {
			message: 'missing parameter: since'
		});
	}
	var until = req.until;
	if (until === undefined) {
		until = new Date();
	}

	var user = req.user;
	//get active campaigns for this user
	Campaign.find({'active': true, 'owner':user._id}).exec(function(err, campaigns) {
		if (err) {
			return res.send(404, {
				message: err
			});
		} else {
			var campaignIds = [];
			for(var i=0; i<campaigns.length; i++)
				campaignIds.push(campaigns[i]._id);
			campaigns = null; //GC this

			var eventAgregator = new EventAgregator(campaignIds, since.getTime(), until.getTime(), function(err, series) {
				if (err) {
					console.dir(err);
					return res.send(400, {
						message: getErrorMessage(err)
					});
				} else {
					res.jsonp(series);
				}
			});

		}
	});
};


/**
 * Create an Event
 */
exports.add = function(type, adId, campaignId) {
	var date = new Date();
	var event = new Event(date, type, adId, campaignId);

	event.save(function(err) {
		if (err) {
			console.log(err);
		}
		console.log('event '+type+' on ad '+adId+' saved');
	});
};

exports.since = function(req, res, next, since) {
	var dateParts = since.split('-');
	try {
		var day = parseInt(dateParts[0]);
		var month = parseInt(dateParts[1]);
		var year = parseInt(dateParts[2]);

		req.since = dayMonthYearToDate(day, month, year);
		next();
	} catch(err) {
		return res.send(400, {
			message: 'bad request'
		});
	}

};
exports.until = function(req, res, next, until) {
	var dateParts = until.split('-');
	try {
		var day = parseInt(dateParts[0]);
		var month = parseInt(dateParts[1]);
		var year = parseInt(dateParts[2]);

		req.until = dayMonthYearToDate(day, month, year);
		req.until.setTime(req.until.getTime()+(24*3600*1000)-1); //23h 59m 999ms
		next();
	} catch(err) {
		return res.send(400, {
			message: 'bad request'
		});
	}
};
