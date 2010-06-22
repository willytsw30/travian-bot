
var SideBar = {};

SideBar.addSendResources = function (tr) {
	var td = document.createElement('td');
	tr.appendChild(td);

	var a = document.createElement('a');
	var img = document.createElement('img');
	img.src = 'img/x.gif';
	img.className = 'r1';
	img.alt = 'Send Resources';
	img.title = 'Send Resources';
	a.appendChild(img);

	var coords = SideBar.gerRowCoords(tr);
	a.href = 'build.php?z='+Map.xy2id(coords.x, coords.y)+'&gid=17';
	td.appendChild(a);
}

SideBar.gerRowCoords = function (tr) {
	var x = XPath.getInt('./td/div[@class="cox"]/text()', tr);
	var y = XPath.getInt('./td/div[@class="coy"]/text()', tr);
	return {x: x, y: y};
}

SideBar.addSendUnits = function (tr){
	var td = document.createElement('td');
	tr.appendChild(td);

	var a = document.createElement('a');
	var img = document.createElement('img');
	img.src = 'img/x.gif';
	img.className = 'unit u1';
	img.alt = 'Send Units';
	img.title = 'Send Units';
	a.appendChild(img);
	
	var coords = SideBar.gerRowCoords(tr);
	a.href = 'a2b.php?z='+Map.xy2id(coords.x, coords.y);
	td.appendChild(a);
}

SideBar.decorateSelectedRow = function (tr) {
	tr.onmouseover = function() {
		XPath.getNode('.//td[@class="dot"]', this).className = 'dot hl';
	}
	tr.onmouseout = function() { 
		XPath.getNode('.//td[@class="dot hl"]', this).className = 'dot';
	}
	
}

SideBar.removeCoords = function (tr) {
	var td = XPath.getNode('./td[@class="aligned_coords"]', tr);
	td.parentNode.removeChild(td);
}

SideBar.isRowCurrentVillage = function (tr) {
	return XPath.getNode('.//td[@class="dot hl"]', tr) != null;
}

SideBar.applyAllChanges = function () {
	var rows = XPath.getNodes('//*[@id="vlist"]//tbody/tr');
	for (var i in rows) {
		var tr = rows[i];
		if (!SideBar.isRowCurrentVillage(tr)) {
			SideBar.addSendResources(tr);
			SideBar.addSendUnits(tr);
			SideBar.decorateSelectedRow(tr);
		}
		
		SideBar.removeCoords(tr);
	}
	
}


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
}


SideBar.applyAllChanges();
Production.addTimers();




