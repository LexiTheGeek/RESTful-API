module.exports = function(p_config){
	//Includes
	var util = require("util");
	var typeCheck = require('type-check').typeCheck;
	var createCustomError = require('custom-error-generator');
	
	//Instance Variables
	var g_errors;
	
	//Constructor
	var _init = function(p_config){
		//Generate Custom Errors From Config File
		g_errors = _buildCustomErrors(_normalizeConfig(p_config));
	}
	
	//Generate Errors From Config
	var _buildCustomErrors = function(p_config){
		//Local Variables
		var r_errors = {};
		var l_customErrors = Object.keys(p_config);

		//Loop Over Error Config
		l_customErrors.forEach(function(i_key){
			
			//Create Custom Error
			r_errors[i_key] = createCustomError	(	i_key, 
													null,
													new _errorConstructor(p_config[i_key])
												);
			
			
			
		})
		
		return r_errors;
	};
	
	//Create Constructor Based Off of Config
	var _errorConstructor = function(p_errConfig){

		//Create Error
		var error = function(p_which){
			//Instance Variables
			g_config = p_errConfig;
			
			//Local Variables 
			var l_which = typeof g_config["subtypes"][p_which] !== 'undefined' ? g_config["subtypes"][p_which] : g_config;
			var l_args = typeof g_config["subtypes"][p_which] !== 'undefined' ? Array.prototype.slice.call(arguments, 1) : Array.prototype.slice.call(arguments, 0); //Get Unused Args, Converted to Array
			
			//Prep Message for Formatting
			l_args.unshift(l_which.message);
			
			//Set Error Vars
			this.code = l_which.code;
			this.message = util.format.apply(null, l_args);	

		}

		return error;
	}
	
	
	//Standardize Error Config
	var _normalizeConfig = function(p_config){
		//Local Variables
		var r_config = p_config;
		var l_default = {};
		var l_reqFields = {
			'code'		: 'String',
			'status'	: 'Number',
			'message' 	: 'String | [String]'
		};
		var l_reqFieldNames = Object.keys(l_reqFields);
			
		//Ensure Object Has Code/Message & Correct Datatypes
		var isValid = function(p_obj, p_reqFields){			
			//Local Variables
			var i_counter = 0;
			var l_reqKeys = Object.keys(p_reqFields);
			var r_problem = false;

			//Check That Fields Exist
			while(i_counter < l_reqKeys.length && !r_problem){
				
				//Validate (Using p_reqFields)
				if(! typeCheck( p_reqFields[l_reqKeys[i_counter]], p_obj[l_reqKeys[i_counter]] )){
					r_problem = true; 
				}else{
					i_counter++;
				}
			}

			return !r_problem;
		}
			
		//Loop Over Errors
		Object.keys(r_config).forEach(function(i_key){
			
			//Ensure Config Has Default Code/Message for Exception
			if(isValid(r_config[i_key], l_reqFields)){
				
				//Get Default Values For Children
				l_reqFieldNames.forEach(function(i_defKey){
					l_default[i_defKey] = r_config[i_key][i_defKey];
				});
				
			
				//Has Children?
				if( typeCheck('Object', r_config[i_key]["subtypes"]) ){
					
					//Yes. Loop Over Them
					Object.keys(r_config[i_key]["subtypes"]).forEach(function(i_childKey){
						
						//Replace Undefined Values With Defaults
						l_reqFieldNames.forEach(function(i_valKey){
							if(typeof r_config[i_key]["subtypes"][i_childKey][i_valKey] === 'undefined'){
								r_config[i_key]["subtypes"][i_childKey][i_valKey] = l_default[i_valKey];
							}
						});
						
						//Is Child Valid? 
						if(  ! isValid( r_config[i_key]["subtypes"][i_childKey], l_reqFields ) ){
							console.log('Error: 3');
						}	
					})
					
				//No Children
				}else{
					//Was 'subtypes' defined at all?
					if(typeof r_config[i_key]["subtypes"] === 'undefined'){
						//No. Normalize. 
						r_config[i_key]["subtypes"] = [];
					
					//Yes
					}else{
						console.log('Error: 2');
					}
				}
			}else{
				console.log('Error: 1');
			}
		});
		
		//Normalized Config
		return r_config;
	};
	
	//Call Constructor
	_init(p_config);

	//Expose 
	return g_errors;
}