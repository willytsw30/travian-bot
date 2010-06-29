var DB = {};
DB.BuildingQueue = {};

DB.connection = null;

DB.test = function() {
	alert('test');
};

DB.init = function () {
	DB.connection = openDatabase("TravianScript", "1.0", "TravianScript Database", 1024*64);
	DB.BuildingQueue.init();
};

DB.DefaultErrorFunction = function (tx, error) {
	console.log('ERROR');
	console.log(error);
};

DB.DefaultRsultFunction = function (tx, result) {
	console.log('RESULT');
	console.log(result);
};

DB.BuildingQueue.init = function() {
	DB.connection.transaction(function(tx) {
		var query = "CREATE TABLE IF NOT EXISTS buildingQueues ("+
			"villageId INTEGER, "+
			"slotId INTEGER NOT NULL, "+
			"priority INTEGER NOT NULL, "+
			"level INTEGER NOT NULL, "+
			"PRIMARY KEY(villageId, slotId, level))";
		tx.executeSql(query, [], DB.DefaultRsultFunction, DB.DefaultErrorFunction);
	});
};

DB.BuildingQueue.enqueue = function (villageId, slotId, level) {
	
	DB.connection.transaction(function(tx) {
		var res = function (tx, result) {
			if (result.rowsAffected > 0) {
				Comm.publish('BuildingQueueChanged');
			}
		};
		
		var query = "INSERT INTO buildingQueues VALUES ("+
			"?, ?, (SELECT COALESCE (MAX(priority), 0)+1 FROM buildingQueues where villageId = ?), ?)";
		tx.executeSql(query, [villageId, slotId, villageId, level], res, DB.DefaultErrorFunction);
	});
};

DB.BuildingQueue.remove = function (villageId, slotId, level) {
	//alert('removing: '+villageId+", "+slotId+", level "+level);
	DB.connection.transaction(function(tx) {
	
		var res = function (tx, result) { 
			if (result.rowsAffected > 0) {
				Comm.publish('BuildingQueueChanged');
			}
		}; 
	
		tx.executeSql(
			"DELETE FROM buildingQueues "+
			"WHERE villageId=? AND slotId=? AND level=?",
			[villageId, slotId, level], res, DB.DefaultErrorFunction);
	});
};

DB.resultToArray = function (SqlResultSet) {
	var res = new Array();
	for (var i=0; i < SqlResultSet.rows.length; ++i) {
		var item = SqlResultSet.rows.item(i);
		var o = new Object();
		for (key in item) {
			o[key] = item[key];
		}
		res.push(o);
	}
	return res;
};

DB.BuildingQueue.publish = function() {
	DB.connection.transaction(function(tx) {
		var query = "SELECT * FROM buildingQueues";
		var res = function (tx, result) {
			Comm.publish('BuildingQueuePublished', DB.resultToArray(result));
		};
		tx.executeSql(query, [], res, DB.DefaultErrorFunction);
	});
};

DB.BuildingQueue.top = function (villageId, callback) {
	DB.connection.transaction(function(tx) {
		var res = function (tx, result) {
			callback(result.rows.item(0));
		};
		var query = 
			"SELECT * "+
			"FROM buildingQueues "+
			"WHERE villageId = ? AND priority = ("+
				"SELECT MIN(priority) "+
				"FROM buildingQueues "+
				"WHERE villageId = ?"+
			")";
		tx.executeSql(query, [villageId, villageId], res, DB.DefaultErrorFunction);
	});
};

DB.getAllVillages = function (callback) {
	DB.connection.transaction(function(tx) {
		var query = "SELECT DISTINCT villageId FROM buildingQueues";
		tx.executeSql(query, [], function (tx, result) {
			callback(DB.resultToArray(result));
		}, DB.DefaultErrorFunction);
	});
	
};



