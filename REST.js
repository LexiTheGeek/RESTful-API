var mysql   = require("mysql");
var dir 	= require('node-dir');

function REST_ROUTER(router,connection) {
    var self = this;
    self.handleRoutes(router,connection);
}

REST_ROUTER.prototype.handleRoutes = function(router,connection) {
    //Local Variables
	var self = this;
	var files = dir.files('api/routes', {sync:true});
	var routes = [];
	
	//Load All Routing Files
	files.forEach(function(e, i){
		routes.push(
			require(
				'./' + e.slice(0, -3).replace(/\\/g, '/')
			)
		)
	})
	
	//Init Each Route File
	routes.forEach(function(route){
		route(router,connection);
	})
	
	
}

module.exports = REST_ROUTER;
