var Building = {};

Building.getId = function () {
	return XPath.getInt('//*[@id="build"]/@class');
}


var Marketplace = {};

Marketplace.isPageFit = function () {
	var gid = Building.getId();
	return BuildingFromId[gid] == 'Marketplace';
}

Marketplace.getTraderRemainingTime = function (traderTable) {
	var time = XPath.getString('.//*[starts-with(@id, "timer")]', traderTable);
	return Util.timeString2Seconds(time);
}

Marketplace.getTraderResources = function (traderTable) {
	var wood = XPath.getInt('.//img[@class="r1"]/following-sibling::text()', traderTable);
	var clay = XPath.getInt('.//img[@class="r2"]/following-sibling::text()', traderTable);
	var iron = XPath.getInt('.//img[@class="r3"]/following-sibling::text()', traderTable);
	var crop = XPath.getInt('.//img[@class="r4"]/following-sibling::text()', traderTable);
	return {
		'wood': wood,
		'clay': clay,
		'iron': iron,
		'crop': crop
	}
}

Marketplace.addTraderResourceRow = function (traderTable, resources) {
	var tr = document.createElement('tr');
	traderTable.appendChild(tr);
	tr.className = 'res';
	tr.appendChild(document.createElement('th'));
	
	var td = document.createElement('td');
	tr.appendChild(td);
	td.colspan = '2';
	
	var img = document.createElement('img');
	img.className = 'r1';
	img.src = "img/x.gif";
	img.alt = "wood";
	td.appendChild(img);
	td.appendChild(document.createTextNode(parseInt(resources.wood)+" | "));
	
	img = document.createElement('img');
	img.className = 'r2';
	img.src = "img/x.gif";
	img.alt = "clay";
	td.appendChild(img);
	td.appendChild(document.createTextNode(parseInt(resources.clay)+" | "));
	
	img = document.createElement('img');
	img.className = 'r3';
	img.src = "img/x.gif";
	img.alt = "iron";
	td.appendChild(img);
	td.appendChild(document.createTextNode(parseInt(resources.iron)+" | "));
	
	img = document.createElement('img');
	img.className = 'r4';
	img.src = "img/x.gif";
	img.alt = "crop";
	td.appendChild(img);
	td.appendChild(document.createTextNode(parseInt(resources.crop)));
	
}

Marketplace.isTraderIncoming = function (traderTable) {
	var span = XPath.getNode('.//tr[@class="res"]//span', traderTable);
	if (span == null || span.className == 'none') {
		return false;
	}
	return true;
}

Marketplace.addTradersResourcePrediction = function () {
	var traders = XPath.getNodes('//table[@class="traders"]');
	var totalSeconds = 0;
	var totalResources = {
		'wood': Resources.getWood(),
		'clay': Resources.getClay(),
		'iron': Resources.getIron(),
		'crop': Resources.getCrop()
	};
	
	for (var i in traders) {
		var trader = traders[i];
		
		totalSeconds = Marketplace.getTraderRemainingTime(trader) - totalSeconds;
		
		var prodResources = Resources.calcProduction(totalSeconds);
		var traderResources = {'wood': 0, 'clay': 0, 'iron': 0, 'crop': 0};
		if (Marketplace.isTraderIncoming(trader)) {
			traderResources = Marketplace.getTraderResources(trader);
		}
		totalResources = {
			'wood': prodResources.wood + traderResources.wood + totalResources.wood,
			'clay': prodResources.clay + traderResources.clay + totalResources.clay,
			'iron': prodResources.iron + traderResources.iron + totalResources.iron,
			'crop': prodResources.crop + traderResources.crop + totalResources.crop
		}
		
		Marketplace.addTraderResourceRow(trader, totalResources);
	
	}
}

Marketplace.applyAllChanges = function () {
	if (Marketplace.isPageFit()) {
		Marketplace.addTradersResourcePrediction();
	}
}


Marketplace.applyAllChanges();


