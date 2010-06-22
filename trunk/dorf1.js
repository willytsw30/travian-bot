

var Production = {};


Production.calcRemainingTime = function() {
	setTimeout('Production.calcRemainingTime();', 1000);
	for (var i in Production.timers) {
		Production.timers[i].calcRemainingTime();
	}
}

Production.timers = new Array();

Production.createTimer = function (productionPerHour, capacity, instock) {
	var span = document.createElement('span');
	//alert(productionPerHour);
	//alert(capacity);
	//alert(instock);
	span.appendChild(document.createTextNode('---'));
	if (productionPerHour != 0) {
		Production.timers.push(span);
		
		var remaining = null;
		if (productionPerHour > 0) {
			remaining = capacity - instock;
			span.className = 'good';
		} else {
			remaining = instock;
			productionPerHour *= -1;
			span.className = 'bad';
		}
		span.totalSeconds = parseInt((remaining / productionPerHour)*3600);
	
		span.calcRemainingTime = function() {
			this.totalSeconds -= 1;
			var t = Util.seconds2TimeString(this.totalSeconds);
			DOM.removeAllChildren(this);
			this.appendChild(document.createTextNode(t));
		}
	}
	
	
	return span;
}

Production.addTimers = function() {

	var woodNode = XPath.getNode('//*[@id="production"]//img[@class="r1"]/../../td[@class="per"]');
	DOM.removeAllChildren(woodNode);
	var woodSpan = Production.createTimer(Resources.getWoodProduction(), Resources.getWherehouseCapacity(), Resources.getWood());
	woodNode.appendChild(woodSpan);
	
	var clayNode = XPath.getNode('//*[@id="production"]//img[@class="r2"]/../../td[@class="per"]');
	DOM.removeAllChildren(clayNode);
	var claySpan = Production.createTimer(Resources.getClayProduction(), Resources.getWherehouseCapacity(), Resources.getClay());
	clayNode.appendChild(claySpan);
	
	var ironNode = XPath.getNode('//*[@id="production"]//img[@class="r3"]/../../td[@class="per"]');
	DOM.removeAllChildren(ironNode);
	var ironSpan = Production.createTimer(Resources.getIronProduction(), Resources.getWherehouseCapacity(), Resources.getIron());
	ironNode.appendChild(ironSpan);
	
	var cropNode = XPath.getNode('//*[@id="production"]//img[@class="r4"]/../../td[@class="per"]');
	DOM.removeAllChildren(cropNode);
	var cropSpan = Production.createTimer(Resources.getCropProduction(), Resources.getGranaryCapacity(), Resources.getCrop());
	cropNode.appendChild(cropSpan);
	
	Production.calcRemainingTime();

	
	Production.calcRemainingTime();
}



Production.addTimers();




