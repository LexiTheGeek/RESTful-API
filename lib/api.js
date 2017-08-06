//Simple Access to Run Tasks
module.exports = function(p_options){
	
	//Imports
	var sqlRunner 		= require('./api/sqlRunner.js');
	var apiControllers 	= require('./api/apiControllers.js');
	var apiDirectory 	= require('./api/apiDirectory.js');
	var apiRunner 		= require('./api/apiRunner.js');
	
	//Constructor
	var _init = function(p_options){
		//Validate Options
		_validateOptions(p_options);
		
		//Validation
		_validateConfig(p_options["config"]);
		
		//Set Instance Variables
		sqlRunner 		= new sqlRunner(p_options.mysql, p_options.exceptions);
		apiControllers 	= new apiControllers(sqlRunner, p_options);  	//Init Controllers, Returns an Object of Methods and their ACL
		apiDirectory 	= new apiDirectory(apiControllers, p_options); 	//Convert Object returned from apiControllers to Traversible Directory
		apiRunner 		= new apiRunner(apiDirectory, p_options);		//apiRunner can execute methods in apiDirectory
	}
	
	//Validate Option Object
	var _validateOptions = function(p_options){
		//Local Variables
		var l_requiredObjs = ['config', 'mysql', 'exceptions', 'logger'];
		
		//Loop Over Required
		l_requiredObjs.forEach(function(p_obj){
			//Does Config Exist 
			if(typeof p_options[p_obj] === 'undefined'){
				throw 'Missing Initialization Object ' + p_obj; //Can't Use Exceptions Object As We Dont Know it Exists
			}
		})	
	}
	
	//Enforce That Our Config Object Has The Required Methods
	var _validateConfig = function(p_config){
		//Local Variables
		var l_requiredFiles = ['permissions', 'settings'];
		
		//Loop Over Required
		l_requiredFiles.forEach(function(p_filename){
			//Does Config Exist 
			if(typeof p_config[p_filename] === 'undefined'){
				throw new p_options.exceptions['ConfigurationError']('required', p_config.dir() + p_filename);
			}
		})	
	}
	
	//Run API Task
	var run = function(p_task, p_req, p_res){
		//Attempt Run
		try{
			apiRunner(p_task, p_req, p_res);
		
		//There was a problem
		}catch(p_err){
			//Log Error
			p_options.logger.error(p_err);
			
			//Send Response
			p_res.jsend.fail({'data' : p_err});
		}
	}
	
	//Initialize
	_init(p_options);
	
	//Expose 
	return run
};