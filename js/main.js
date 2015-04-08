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


var Game = function(gameElem){
	var points = (function(){
	var score = toInt(docCookies.getItem('points')) || 0;
		console.log(score);
		var inc = function(x) {
			if(score + x < 0)
				return false;
			score += x;
			text.innerHTML = "POINT TOTAL: " + score;
			docCookies.setItem('points', String(score), Infinity);
			console.log(docCookies.getItem('points') + ', ' + docCookies.hasItem('points'));
			return true;
		}
		
		var text = document.createElement("div");
		text.innerHTML = "POINT TOTAL: 0";
		gameElem.appendChild(text);
		
		var button = document.createElement("button");
		button.setAttribute('type', 'button');
		button.onclick = function() {inc(1)};
		button.innerHTML = "GET";
		gameElem.appendChild(button);
		
		return {score:score, inc:inc};
	})();
	var production = (function(){
		var count = 0;
				
		var bought = 0;
		
		function buy(x){
			var cost = bought*x*100;
			if(points.inc(-cost)) 
				bought+=x;
			cost = bought*x*100;
			text.innerHTML = "PASSIVE POINT GAIN: " + bought;
			button.innerHTML = "SPEND ("+cost+")";
		}

		var text = document.createElement("div");
		text.innerHTML = "PASSIVE POINT GAIN: 0";
		gameElem.appendChild(text);
		
		var button = document.createElement("button");
		button.setAttribute('type', 'button');
		button.onclick = function(){buy(1)};
		button.innerHTML = "SPEND";
		gameElem.appendChild(button);
	})();
};

window.onload = function(){
	Game(document.getElementsByTagName('body')[0]);
};
