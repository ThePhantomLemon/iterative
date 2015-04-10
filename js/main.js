
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

	var Iterator = function(parentElem, cID, textPreface, buttonPreface, check){
		var that = {
			cookieID : cID,
			count : parseInt(docCookies.getItem(cID)) || 0,
			inc : function(x) {
				if(check(that, x)) {
					that.count+=x;
				} else {
					return false;
				}

				that.text.innerHTML = textPreface + that.count;
				that.button.innerHTML = buttonPreface;// + "(" + 0 + ")";
				docCookies.setItem(cID, String(this.count), Infinity);
				return true;
			},
			text : document.createElement("span")
		};

		that.text.innerHTML = textPreface + that.count;
		parentElem.appendChild(that.text);

		that.button = document.createElement("button");
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
	var point = new Iterator(div1, 'point', "_P: ", "GET", function(that, x){return that.count + x >= 0;  });
	var delta = new Iterator(div2, 'delta', "\u0394P: ", "GET", function(that, x){return point.inc(-(that.count + x)*50); });

	window.setInterval(function(){ point.inc(delta.count)}, 1000);

};

window.onload = function(){
	Game(document.getElementsByTagName('body')[0]);
};
