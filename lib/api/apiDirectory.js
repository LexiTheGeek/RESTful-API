module.exports = function(p_directory, p_options){

	//Includes
	var uObj = require('../util/uObj.js');
	
	//Instance Variables
	var g_validation = {"acl":"string", "method":"function"};
	var g_directory = p_directory;
	
	//Lookup Settings For Requested Task
	var get = function(p_task){
		//Local Variables
		var r_settings = uObj.get(g_directory, p_task);

		//Validate Settings
		if( typeof r_settings === 'undefined' || !uObj.conforms(r_settings, g_validation) ){
			throw new p_options.exceptions['ConfigurationError'](p_options.config.dir() + 'permissions'); 
		}
		
		return r_settings;
	} 
	
	//Expose Directory
	return get;
}