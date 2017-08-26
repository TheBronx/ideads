'use strict';

var Ideads = function(undefined) {
	var _this = this;
	var server = 'http://ideads.com.es/ideads/';
	var w = document.write;

	this.load = function() {
		var places = document.getElementsByClassName('ideads');
		if (places.length > 0) {
			Array.prototype.forEach.call(places, function(place) {
				_this.loadAndDisplayAd(place);
			});
		}
	};

	this.loadAndDisplayAd = function(place) {
		var placeId = place.id.replace('ideads-','');
		_this.loadAd(placeId, _this.displayAd);
	};

	this.overrideDocumentWriteFunction = function(container) {
		document.write = function(content) {
			container.innerHTML = content;
			document.write = _this.w;
		};
	};

	this.displayAdsense = function(placeId, ad) {
		var div = document.getElementById('ideads-'+placeId);
		var script = document.createElement('script');

		_this.overrideDocumentWriteFunction(div);
		script.type = 'text/javascript';
		script.innerHTML = ad.content.replace('[adsense]', '').replace('[/adsense]', '');

		div.style.width = ad.width;
		div.style.height = ad.height;
		div.style.display = 'block';

		document.body.appendChild(script);
	};

	this.displayAd = function(placeId, ad) {
		if (ad.content.indexOf('[adsense]') === 0) {
			_this.displayAdsense(placeId, ad);
			return;
		}

		if (ad.image !== undefined && ad.image !== '') {
			ad.content = ad.content.replace(/\{\{image\}\}/gi, ad.image);
			ad.content = ad.content.replace('src=', 'class="img-responsive" src=');
		}

		var div = document.getElementById('ideads-'+placeId);

		var element = document.createElement('a');
		element.href = server + placeId + '/click/' + ad._id;
		element.target = '_blank';
		element.innerHTML = ad.content;

		div.style.cursor = 'pointer';
		div.style.width = ad.width;
		div.style.height = ad.height;
		div.style.display = 'inline-block';
		div.appendChild(element);
	};

	this.loadAd = function(placeId, callback) {
		var url = server + placeId;
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				if(xmlhttp.status == 200){
					var ad = JSON.parse(xmlhttp.responseText);
					callback(placeId, ad);
				}
				else {
					console.log('something went wrong');
				}
			}
		};

		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	};

};

var ideads = new Ideads();
ideads.load();
