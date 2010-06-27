

var Production = {};
var BuildingQueue = {}
var Fields = {}


Production.calcRemainingTime = function() {
	setTimeout('Production.calcRemainingTime();', 1000);
	for (var i in Production.timers) {
		Production.timers[i].calcRemainingTime();
	}
}

Production.timers = new Array();

Production.createTimer = function (productionPerHour, capacity, instock) {
	var span = document.createElement('span');
	span.appendChild(document.createTextNode('---'));
	if (productionPerHour == 0)
		return span;
		
	
	Production.timers.push(span);
	
	var remaining = null;
	if (productionPerHour > 0) {
		remaining = capacity - instock;
		span.className = 'good';
	} else { // negative production
		remaining = instock;
		productionPerHour *= -1;
		span.className = 'bad';
	}
	span.totalSeconds = parseInt((remaining*3600 / productionPerHour));

	span.calcRemainingTime = function() {
		(this.totalSeconds == 0) ? this.className = 'bad' : this.totalSeconds -= 1;
		var t = Util.seconds2TimeString(this.totalSeconds);
		DOM.removeAllChildren(this);
		this.appendChild(document.createTextNode(t));
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

BuildingQueue.displayBuildingQueue = function () {
	var villageId = SideBar.getCurrentVillageId();
	
	var onBuildingQueuePublished = function (eventName, rows) {		
		var table = document.createElement('table');
		var n = XPath.getNode('//div[@id="content"]');
		n.appendChild(table);
		for (var i=0; i < rows.length; ++i) {
			if (rows[i].villageId != villageId)
				continue;

			var tr = document.createElement('tr');
			table.appendChild(tr);

			var td = document.createElement('td');
			var img = document.createElement('img');
			img.src = 'img/x.gif';
			img.className = 'del';
			var a = document.createElement('a');
			a.appendChild(img);
			a.href = '#';
			a.onclick = (function(villageId, slotId, level) {
				return function() {
					Comm.invoke(null, 'BuildingQueue.remove', villageId, slotId, level);
					return false;
				};
			})(rows[i].villageId, rows[i].slotId, rows[i].level);
			
			td.appendChild(a);
			tr.appendChild(td);
			
			td = document.createElement('td');
			a = document.createElement('a');
			var buildingName = Fields.getName(rows[i].villageId, rows[i].slotId);
			a.appendChild(document.createTextNode(buildingName+' in slot '+rows[i].slotId+' level '+rows[i].level));
			a.href = 'build.php?newdid='+rows[i].villageId+'&id='+rows[i].slotId;
			td.appendChild(a);
			tr.appendChild(td);
		}
		Comm.subscribe(function() {
			n.removeChild(table);
			BuildingQueue.displayBuildingQueue();
		}, 'BuildingQueueChanged');
	}
	
	Comm.subscribe(onBuildingQueuePublished, 'BuildingQueuePublished');
	Comm.invoke(null, 'BuildingQueue.publish');
}

BuildingQueue.displayBuildingQueue();
Production.addTimers();

Fields.storeVillageClass = function () {
	var villageId = parseInt(SideBar.getCurrentVillageId());
	var villageClass = XPath.getString('//*[@id="village_map"]/@class');
	localStorage.setItem('VillageClass['+villageId+']', villageClass);
}

Fields.getName = function(villageId, slotId) {
	slotId = parseInt(slotId);
	if (slotId < 1 || 18 < slotId)
		return null;
	var villageClass = localStorage.getItem('VillageClass['+villageId+']');
	if (villageClass == null)
		return null;

	var fieldId = FieldIdFromVillageClass[villageClass][slotId];
	
	return FieldNameFromId[fieldId]
}

Fields.storeVillageClass();




