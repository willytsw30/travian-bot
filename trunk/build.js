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
	
	var capacity = Resources.getWherehouseCapacity();
	var span;
	
	td.appendChild(Resources.createWoodIcon());
	span = document.createElement('span');
	span.appendChild(document.createTextNode(""+parseInt(resources.wood)));
	if (resources.wood > capacity)
		span.className = 'bad';
	td.appendChild(span);
	td.appendChild(document.createTextNode(" | "));
		
	td.appendChild(Resources.createClayIcon());
	span = document.createElement('span');
	span.appendChild(document.createTextNode(""+parseInt(resources.clay)));
	if (resources.clay > capacity)
		span.className = 'bad';
	td.appendChild(span);
	td.appendChild(document.createTextNode(" | "));
	
	td.appendChild(Resources.createIronIcon());
	span = document.createElement('span');
	span.appendChild(document.createTextNode(""+parseInt(resources.iron)));
	if (resources.iron > capacity)
		span.className = 'bad';
	td.appendChild(span);
	td.appendChild(document.createTextNode(" | "));
	
	capacity = Resources.getGranaryCapacity();
	
	td.appendChild(Resources.createCropIcon());
	span = document.createElement('span');
	span.appendChild(document.createTextNode(""+parseInt(resources.crop)));
	if (resources.crop > capacity)
		span.className = 'bad';
	td.appendChild(span);
	
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
Marketplace.getAvailabileTraders = function () {
	var mer = XPath.getString('//*[@id="target_select"]//*[@class="mer"]/text()');
	mer = mer.match(/[0-9]+\/[0-9]+/g).toString();
	return parseInt(mer.split('/')[0]);
}
Marketplace.getTraderCapacity = function () {
	return XPath.getInt('//*[@id="send_select"]//*[@class="max"][1]//a/text()');
}

Marketplace.getTotalCarring = function() {
	wood = XPath.getNode('//*[@id="r1"]').value;
	wood = (wood == '') ? 0 : parseInt(wood);
	
	clay = XPath.getNode('//*[@id="r2"]').value;
	clay = (clay == '') ? 0 : parseInt(clay);
	
	iron = XPath.getNode('//*[@id="r3"]').value;
	iron = (iron == '') ? 0 : parseInt(iron);
	
	crop = XPath.getNode('//*[@id="r4"]').value;
	crop = (crop == '') ? 0 : parseInt(crop);
	
	return  wood + clay + iron + crop;
}

Marketplace.createTotalResourcesNode = function () {
	var span = document.createElement('span');
	span.calcSpaceLeft = function () {
		var totalCapacity = Marketplace.getTraderCapacity() * Marketplace.getAvailabileTraders();
		var totalCarry = Marketplace.getTotalCarring();
		DOM.removeAllChildren(this);
		this.appendChild(document.createTextNode(totalCarry+"/"+totalCapacity));
		(totalCarry > totalCapacity) ? this.className = 'bad' : this.className = 'good';
	}
	span.calcSpaceLeft();
	
	// adding change listeners
	var nodes = XPath.getNodes('//*[starts-with(@onmouseup, "add_res")]');
	for (var i in nodes) {
		nodes[i].onmouseup = (function(span, oldFunc) {
			return function() { oldFunc(); span.calcSpaceLeft(); }
		})(span, nodes[i].onmouseup);
	}
	nodes = XPath.getNodes('//*[starts-with(@onkeyup, "upd_res")]');
	for (var i in nodes) {
		nodes[i].onkeyup = (function(span, oldFunc) {
			return function() { oldFunc(); span.calcSpaceLeft(); }
		})(span, nodes[i].onkeyup);
	}
	
	return span;
}
Marketplace.createAddAllResourcesLink = function () {
	var a = document.createElement('a');
	a.href = "#";
	a.onclick = function () { return false; }
	a.onmouseup = function() {
		var rows = XPath.getNodes('//table[@id="send_select"]//tr[./td[1]/@class = "ico"]');
		for (var i in rows) {
			var cb = XPath.getNode('.//input[@type="checkbox"]', rows[i]);
			if (cb == null || cb.checked)
				XPath.getNode('.//*[starts-with(@onmouseup, "add_res")]', rows[i]).onmouseup();
		}
	}
	a.appendChild(document.createTextNode('('+Marketplace.getTraderCapacity()+')'));
	return a;
}
Marketplace.addResourcesCheckboxes = function () {
	var cbs = new Array();
	var rows = XPath.getNodes('//table[@id="send_select"]//tr[./td[1]/@class = "ico"]');
	for (var i in rows) {
		var cb = document.createElement('input');
		cb.type = 'checkbox';
		var rNum = parseInt(i)+1;
		cb.defaultChecked = Settings.Marketplace['r'+rNum+'Checkbox'];
		rows[i].appendChild(cb);
		cbs.push(cb);
	}
	var cb = document.createElement('input');
	cb.type = 'checkbox';
	cb.onclick = (function (cbs) {
		return function() {
			for (var i in cbs)
				cbs[i].checked = this.checked;
		}})(cbs);
	return cb;
}


Marketplace.addTradersCapacity = function () {
	table = XPath.getNode('//table[@id="send_select"]');
	tr = document.createElement('tr');
	table.appendChild(tr);
	
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Total'));
	tr.appendChild(td);
	
	tr.appendChild(document.createElement('td'));
	
	td = document.createElement('td');
	td.appendChild(Marketplace.createTotalResourcesNode());
	tr.appendChild(td);
	
	td = document.createElement('td');
	td.className = 'max';
	td.appendChild(Marketplace.createAddAllResourcesLink());
	tr.appendChild(td);
	
	td = document.createElement('td');
	td.appendChild(Marketplace.addResourcesCheckboxes());
	tr.appendChild(td);
	
	
}

Marketplace.applyAllChanges = function () {
	if (Marketplace.isPageFit()) {
		Marketplace.addTradersResourcePrediction();
		Marketplace.addTradersCapacity();
	}
}


Marketplace.applyAllChanges();


