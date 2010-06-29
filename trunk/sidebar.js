
var SideBar = {};

SideBar.addSendResources = function (tr) {
	var td = document.createElement('td');
	tr.appendChild(td);

	var a = document.createElement('a');
	a.appendChild(Resources.createWoodIcon());

	var coords = SideBar.gerRowCoords(tr);
	a.href = 'build.php?z='+Map.xy2id(coords.x, coords.y)+'&gid=17';
	td.appendChild(a);
};

SideBar.gerRowCoords = function (tr) {
	var x = XPath.getInt('./td/div[@class="cox"]/text()', tr);
	var y = XPath.getInt('./td/div[@class="coy"]/text()', tr);
	return {x: x, y: y};
};

SideBar.addSendUnits = function (tr){
	var td = document.createElement('td');
	tr.appendChild(td);

	var a = document.createElement('a');
	a.appendChild(Units.createIcon());
	
	var coords = SideBar.gerRowCoords(tr);
	a.href = 'a2b.php?z='+Map.xy2id(coords.x, coords.y);
	td.appendChild(a);
};

SideBar.decorateSelectedRow = function (tr) {
	tr.onmouseover = function() {
		XPath.getNode('.//td[@class="dot"]', this).className = 'dot hl';
	};
	tr.onmouseout = function() { 
		XPath.getNode('.//td[@class="dot hl"]', this).className = 'dot';
	};
	
};

SideBar.removeCoords = function (tr) {
	var td = XPath.getNode('./td[@class="aligned_coords"]', tr);
	td.parentNode.removeChild(td);
};

SideBar.isRowCurrentVillage = function (tr) {
	return XPath.getNode('.//td[@class="dot hl"]', tr) != null;
};

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
	
};
SideBar.getCurrentVillageId = function () {
	var n = XPath.getNode('//*[@id="side_info"]//td[@class="dot hl"]/..//a');
	if (n == null)
		return null;
	return Util.getURLQuery(n.href).newdid;
};


SideBar.applyAllChanges();


