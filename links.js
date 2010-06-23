var Village = {};


Village.addSendResources = function (aNode) {
	var id = aNode.href.split('d=')[1].split('&')[0];
	var a = document.createElement('a');
	a.appendChild(Units.createIcon());
	a.href = 'a2b.php?z='+id;
	aNode.parentNode.insertBefore(a, aNode.nextSibling);
}

Village.addSendUnits = function (aNode) {
	var id = aNode.href.split('d=')[1].split('&')[0];
	var a = document.createElement('a');
	a.appendChild(Resources.createWoodIcon());
	a.href = 'build.php?z='+id+'&gid=17';
	aNode.parentNode.insertBefore(a, aNode.nextSibling);
}

Village.applyAllChanges = function () {
	var villages = XPath.getNodes('//a[starts-with(@href, "karte.php?d=")]');
	for (var i in villages) {
		var v = villages[i];
		Village.addSendResources(v);
		Village.addSendUnits(v);

	}
}


var Player = {};

Village.applyAllChanges();





