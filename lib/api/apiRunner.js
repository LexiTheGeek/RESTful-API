module.exports = function(p_apiDirectory, p_options){
	
	//Includes
	var fs = require('fs');
	var authorize = require('./authorize.js');

	//Instance Variables
	var g_config, g_methodDir, g_auth, g_errors;
	
	//Constructor
	var _init = function(p_apiDirectory, p_config, p_exceptions){
		//Instance Variables
		g_config = p_config;
		g_errors = p_exceptions;
		g_methodDir = p_apiDirectory;
		g_auth = new authorize(p_config.settings("authorize_url"), p_config, p_exceptions);
	}
	
	//Run Authorization & Task
	var run = function(p_task, p_req, p_res){
		//Local Variables
		var l_settings = g_methodDir(p_task);//Lookup Settings For This Method
		
		//Authorization Enabled (See config/settings.json) 
		if(g_config.settings("authorize")){
			
			//Authorize Request
			g_auth(p_req.cookies, l_settings["acl"]).then(function(p_auth){

				//Auth Success
				if(p_auth['status'] == 'success'){
					//Run 
					l_settings["method"](p_req, p_res);
				
				//Auth Fail
				}else{
					p_res.jsend.fail(p_auth["data"]);
				}
			});
		
		//Authorization Disabled 
		}else{
			l_settings["method"](p_req, p_res);
		}
	}	

	//Initialize
	_init(p_apiDirectory, p_options.config, p_options.exceptions);
	
	//Expose
	return run;
}