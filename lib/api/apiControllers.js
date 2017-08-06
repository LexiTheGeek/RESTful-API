module.exports = function (p_sqlRunner, p_options){
	//Includes
	var fs = require("fs");
	
	//Build Task Directory
	var _build = function(p_sqlRunner, p_options){
		//Local Variables
		var l_permissions = p_options["config"].permissions();
		var l_pathToControllers = "../../api/controllers/";
		var l_modules = {};
		var r_config = {};
		
		//Loop Over Config
		Object.keys(l_permissions).forEach(function(p_module){
			//Include Controller Files	
			l_modules[p_module] = require(l_pathToControllers + l_permissions[p_module]["file"])(p_sqlRunner, p_options.config.tasks(p_module), p_options.exceptions, p_options.logger)
			
			//Create Container For File
			r_config[p_module] = {};
			
			//Loop Over Controller Methods
			Object.keys(l_permissions[p_module]["acl"]).forEach(function(p_method){
				
				//Save ACL & Method Reference
				r_config[p_module][p_method] = {
					"acl" 		: l_permissions[p_module]["acl"][p_method],
					"method"	: l_modules[p_module][p_method]
				}
			});		
		})
		
		//Structure Has Been Built
		return r_config;
	};
	
	return _build(p_sqlRunner, p_options)
}


