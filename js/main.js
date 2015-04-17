
var Game = function(gameElem){
	var docCookies = {
		getItem: function (sKey) {
			if (!sKey) { return null; }
			return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
		},
		setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
			if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
			var sExpires = "";
			if (vEnd) {
				switch (vEnd.constructor) {
					case Number:
						sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
						break;
					case String:
						sExpires = "; expires=" + vEnd;
						break;
					case Date:
						sExpires = "; expires=" + vEnd.toUTCString();
						break;
				}
			}
			document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
			return true;
		},
		removeItem: function (sKey, sPath, sDomain) {
			if (!this.hasItem(sKey)) { return false; }
			document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
			return true;
		},
		hasItem: function (sKey) {
			if (!sKey) { return false; }
			return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		},
		keys: function () {
			var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
			for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
			return aKeys;
		}
	};
	var intToText = function(n, b) {
		b = b || 0;
		if( n == 0)
			if(b == 0)
				return 'zero';
			else
				return '';
		if(n < 0) {
			return 'negative' + intToText(n*-1);
		}

		var single = [
			['zero', ''	 ],	['one', 'one'], ['two'  , 'twen' ],	['three', 'thir'],	['four', 'for'],
			['five','fif'], ['six', 'six'], ['seven', 'seven'], ['eight', 'eigh'], ['nine', 'nine']
		];

		return (((Math.floor(n/1000)) ? intToText(n/1000, b + 1) + ' ' + base(b) + ' ' : '' ) +
				((Math.floor(n/100)%10)
					? single[Math.floor(n/100)%10][0] + ' hundred'
					: ''
				)
				+ ((Math.floor(n/10)%10 != 1)
					?
						((Math.floor(n/10)%10)
							? ' ' + single[Math.floor(n/10)%10][1] + 'ty'
							: ''
						)
						+ ((Math.floor(n)%10)
							? ((Math.floor(n/10)%10) ? '-' : '') + single[Math.floor(n)%10][0]
							: ''
						)
					: ((Math.floor(n)%10 > 2)
						? ' ' + single[Math.floor(n)%10][1] + 'teen'
						: ' ' + ['ten', 'eleven', 'twelve'][Math.floor(n)%10]
					)
				)).replace(/\s+/g,' ').trim();

	};
	var base = function(x) {
		if(!x)
			return 'thousand';
		if(x>=1000)
			return base(x-999) + 'illion';
		return ((x < 10)
				? [ '', 'm', 'b', 'tr', 'qadr', 'quint', 'sext', 'sept', 'oct', 'non'][x]
				: ['', 'un', 'duo', 'tre' + ((Math.floor(x/10) !== 1) ? 's' : ''), 'quattuor', 'quinqua', 'sed', 'septen', 'octo', 'noven'][x%10]
					+ ['', 'dec', 'vi', 'tri', 'quadra', 'quinqua', 'sexa', 'septua', 'octo', 'nona'][Math.floor(x/10)%10]
					+ ((Math.floor(x/10)%10 !== 1)
						? 'gint'
						: ''
					)
					+ ((x >= 110)
						? 'i'
						: ''
					)
					+ ((x >= 100)
						?  ['cent','ducent','trecent', 'quadringent', 'quingent', 'sescent', 'septingent', 'octingent', 'nongent'][Math.floor(x/100)]
						: ''
					)
			) + 'illion';
	};

	var Iterator = function(parentElem, cID, textPreface, buttonPreface, check, intervalFunc, intervalTime){
		var that = {
			intervalID : (intervalFunc) ? window.setInterval(intervalFunc, intervalTime || 1000) : null,
			cookieID : cID,
			count : parseInt(docCookies.getItem(cID)) || 0,
			inc : function(x) {
				if(check(that, x)) {
					that.count+=x;
				} else {
					return false;
				}

				that.text.innerHTML = textPreface + that.count;
				that.button.innerHTML = buttonPreface;
				docCookies.setItem(cID, String(this.count), Infinity);
				return true;
			},
			setIntervalFunc: function(newFunc) {
				if(this.intervalID)
					window.clearInterval(this.intervalID);

				this.intervalID = window.setInterval(newFunc);

			},
			setIntervalTime: function(newTime) {
				if(!this.intervalID)
					return false;
				window.clearInterval(this.intervalID);
				intervalTime = newTime;
				window.setInterval(intervalFunc, newTime);
			},
			text : document.createElement("span"),
			button : document.createElement("button")
		};

		that.text.innerHTML = textPreface + that.count;
		parentElem.appendChild(that.text);

		that.button.setAttribute('type', 'button');
		that.button.onclick = function() {that.inc(1)};
		that.button.innerHTML = buttonPreface;
		parentElem.appendChild(that.button);


		return that;
	};

	var div1 = document.createElement('div');
	var div2 = document.createElement('div');
	gameElem.appendChild(div1);
	gameElem.appendChild(div2);
	var point = new Iterator(div1, 'point', "P: ", "GET", function(that, x){return that.count + x >= 0;  });
	var delta = new Iterator(div2, 'delta', "\u0394P: ", "GET", function(that, x){return point.inc(-(that.count + x)*50); });
	//+^ <T <<c
	window.setInterval(function(){ point.inc(delta.count)}, 1000);

	return {
		intToText : intToText
	}
};
var game;
window.onload = function(){
	game = new Game(document.getElementsByTagName('body')[0]);
};
