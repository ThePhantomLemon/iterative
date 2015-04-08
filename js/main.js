var Game = function(gameElem){
	var points = (function(){
		var score = 0;
		
		var inc = function(x) {
			if(score + x < 0)
				return false;
			score += x;
			scoreElem.innerHTML = "POINT TOTAL: " + score;
			return true;
		}
		
		var text = document.createElement("div");
		text.innerHTML = "POINT TOTAL: 0";
		gameElem.appendChild(text);
		
		var button = document.createElement("div");
		button.setAttribute('type', 'button');
		button.setAttribute('onclick', 'inc(1)');
		button.innerHTML = "GET";
		gameElem.appendChild(button);
		
		return {score:score, inc:inc};
	})();
	var production = (function(){
		var count = 0;
				
		var bought = 0;
		
		function buy(x){
			var cost = bought*x*100;
			if(inc(-cost)) 
				bought+=x;
			cost = bought*x*100;
			passiveElem.innerHTML = "PASSIVE POINT GAIN: " + bought;
			buyButton.innerHTML = "SPEND ("+cost+")";
		}

		var text = document.createElement("div");
		text.innerHTML = "PASSIVE POINT GAIN: 0";
		gameElem.appendChild(text);
		
		var button = document.createElement("button");
		button.setAttribute('type', 'button');
		button.setAttribute('onclick', 'buy(1)');
		button.innerHTML = "SPEND";
		gameElem.appendChild(text);
	})();
};

window.onload = function(){
	Game(document.getElementsByTagName('body')[0]);
};
