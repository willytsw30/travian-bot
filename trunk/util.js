
var XPath = {};

XPath.getString = function (query, root) {
	root = root || document;
	return document.evaluate(query ,root, null, XPathResult.STRING_TYPE, null).stringValue;
}

XPath.getInt = function (query, root) {
	root = root || document;
	return parseInt(document.evaluate(query ,root, null, XPathResult.STRING_TYPE, null).stringValue.match(/[\-]?[0-9]+/));
}

XPath.getNodes = function (query, root) {
	root = root || document;
	var res = new Array();
	var itr = document.evaluate(query ,root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
	var node = itr.iterateNext();
	while (node) {
		res.push(node);
		node = itr.iterateNext();
	}
	return res;
}

XPath.getNode = function (query, root) {
	root = root || document;
	return document.evaluate(query ,root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


var Map = {};

Map.xy2id = function (x, y) {
	return (((400-parseInt(y))*801)+(parseInt(x)+401));
}

/*
Map.id2xy = function (id) {
	var x = (id % 801) - 401;
	var y = 400 - (id - 401 - x) / 801;
	return 	{x: x, y: y};
}
*/
var DOM = {};
DOM.removeAllChildren = function (node) {
	while (node.firstChild != null) {
		node.removeChild(node.firstChild);
	}
}

var Resources = {};
Resources.getWood = function () {
	return parseInt(XPath.getString('//*[@id="l4"]/text()').split("/")[0]);
}
Resources.getWoodProduction = function () {
	return XPath.getInt('//*[@id="l4"]/@title');
}
Resources.getWherehouseCapacity = function () {
	return parseInt(XPath.getString('//*[@id="l4"]/text()').split("/")[1]);
}

Resources.getClay = function () {
	return parseInt(XPath.getString('//*[@id="l3"]/text()').split("/")[0]);
}
Resources.getClayProduction = function () {
	return XPath.getInt('//*[@id="l3"]/@title');
}

Resources.getIron = function () {
	return parseInt(XPath.getString('//*[@id="l2"]/text()').split("/")[0]);
}
Resources.getIronProduction = function () {
	return XPath.getInt('//*[@id="l2"]/@title');
}

Resources.getCrop = function () {
	return parseInt(XPath.getString('//*[@id="l1"]/text()').split("/")[0]);
}
Resources.getCropProduction = function () {
	return XPath.getInt('//*[@id="l1"]/@title');
}
Resources.getGranaryCapacity = function () {
	return parseInt(XPath.getString('//*[@id="l1"]/text()').split("/")[1]);
}

Resources.calcProduction = function(seconds) {
	var wood = Resources.getWoodProduction();
	var clay = Resources.getClayProduction();
	var iron = Resources.getIronProduction();
	var crop = Resources.getCropProduction();
	
	hours = seconds/3600;
	return { 
		'wood': wood*hours,
		'clay': clay*hours,
		'iron': iron*hours,
		'crop': crop*hours
	}
}


var Util = {};
Util.seconds2TimeString = function (secs) {
	var s = secs % 60;
	var m = parseInt(secs / 60) % 60;
	var h = parseInt(secs / 3600);
	if (s < 10)
		s = "0"+s;
	if (m < 10)
		m = "0"+m;
	return h+":"+m+":"+s;
}
Util.timeString2Seconds = function (ts) {
	var h = parseInt(ts.split(':')[0]);
	var m = parseInt(ts.split(':')[1]);
	var s = parseInt(ts.split(':')[2]);
	return h*3600 + m*60 + s;
}












