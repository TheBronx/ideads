'use strict';
/*globals $, data*/


angular.module('core').controller('DashboardController', ['$scope', '$http', 'Authentication',
	function($scope, $http, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.campaigns = data.campaigns;
		if (data.campaigns === undefined) {
			window.location = '/';
		}

		$scope.since = new Date();
		$scope.since.setTime($scope.since.getTime() - 30 * 24 * 3600 * 1000); //30 days ago
		$scope.until = new Date(); //today


		function getBaseDay(timestamp) {
			return (timestamp - timestamp%(24*3600*1000));
		}

		function sanitizeDates() {
			$scope.since.setTime(getBaseDay($scope.since.getTime())); //00h 00m 000ms
			$scope.until.setTime(getBaseDay($scope.until.getTime())); //00h 00m 000ms
		}

		function getStats(drawPlotCallback, tableStatsCallback) {
			var sinceDMY = ''+$scope.since.getDate()+'-'+($scope.since.getMonth()+1)+'-'+$scope.since.getFullYear();
			var untilDMY = ''+$scope.until.getDate()+'-'+($scope.until.getMonth()+1)+'-'+$scope.until.getFullYear();
			$http.get('/stats/since-'+sinceDMY+'/until-'+untilDMY).
				success(function(series, status, headers, config) {
					drawPlotCallback(series.plot);
					tableStatsCallback(series.table);
				}).
				error(function(data, status, headers, config) {
					// log error
					console.log('error');
				});
		}

		function clearAllSeries() {
			var chart = $('#chart1').highcharts();
			for(var i=0; i<chart.series.length; i++) {
				chart.series[i].remove();
			}
		}

		function drawGraphic(timeseries) {
			clearAllSeries();

			timeseries[0].name = 'views';
			timeseries[0].color = '#4d90fe';
			timeseries[0].marker = {'symbol': 'circle'};
			timeseries[0].yAxis = 0;

			timeseries[1].name = 'clicks';
			timeseries[1].color = '#ed561b';
			timeseries[1].marker = {'symbol': 'diamond'};
			timeseries[1].yAxis = 1;

			$scope.chartConfig = {
				options: {
					chart: {
						type: 'line',
						zoomType: 'x'
					}
				},
				series: timeseries,
				title: {
					text: $scope.since.getDate()+'/'+($scope.since.getMonth()+1)+'/'+$scope.since.getFullYear()+
						' - '+
						$scope.until.getDate()+'/'+($scope.until.getMonth()+1)+'/'+$scope.until.getFullYear()
				},
				xAxis: {
					type: 'datetime',
					dateTimeLabelFormats: {
						day: '%e. %b'
					},
					title: {
						text: 'Date'
					}
				},
				yAxis: [
					{
						title: {
							text: 'Views',
							style: {
								color: '#4d90fe'
							}
						},
						floor: 0,
						opposite: false
					},
					{
						title: {
							text: 'Clicks',
							style: {
								color: '#ed561b'
							}
						},
						floor: 0,
						opposite: true
					}
				],
				loading: false
			};
		}

		function resetCampaignAdStats() {
			$scope.campaigns.forEach(function(campaign) {
				campaign.ads.forEach(function(ad) {
					ad.stats = {'views': 0, 'clicks': 0};
				});
			});
		}

		function setAdStats(adId, adStats) {
			$scope.campaigns.forEach(function(campaign) {
				campaign.ads.forEach(function(ad) {
					if (ad._id === adId) {
						ad.stats.views = adStats.views;
						ad.stats.clicks = adStats.clicks;
					}
				});
			});
		}

		function showTableStats(adStats) {
			for (var adId in adStats) {
				setAdStats(adId, adStats[adId]);
			}
		}

		$scope.openDatepicker = function($event, datepickerFlag) {
			$event.preventDefault();
			$event.stopPropagation();

			if (datepickerFlag === 'since') {
				$scope.sinceOpened = true;
				$scope.untilOpened = false;
			}
			else if (datepickerFlag === 'until') {
				$scope.sinceOpened = false;
				$scope.untilOpened = true;
			}
		};
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1,
			showWeeks: false
		};

		$scope.reloadStats = function() {
			if ($scope.since === undefined || $scope.until === undefined)
				return;
			if ($scope.since === '' || $scope.until === '')
				return;

			$scope.chartConfig = {
				title: {
					text: 'Loading data'
				},
				loading: true
			};

			sanitizeDates();
			resetCampaignAdStats();
			getStats(drawGraphic, showTableStats);
		};

		$scope.reloadStats();
	}
]);
