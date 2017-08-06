module.exports = function(p_config){

	//Includes
	var winston = require('winston');
	
	//Initialize Loggers
	var _init = function(p_config){
		//Validate Winston Configuration
		_validateLoggingSettings(p_config);
		
		//Start Winston
		return new (winston.Logger)({
			transports: _buildWinstonTransports(p_config) //From config/logging
		});
	};
	
	//Validate Logging Settings From Config
	var _validateLoggingSettings = function(p_config){
		var l_required = ['directory', 'levels'];
		
		//Validate
		l_required.forEach(function(i_field){
			if(typeof p_config[i_field] === 'undefined'){
				throw 'A Configure Problem Was Detected in ' + p_config.dir() + 'logging';
			}
		})
	}
	
	//Build Winston Transports From Config
	var _buildWinstonTransports = function(p_config){
		//Local Variables
		var l_levels = Object.keys(p_config["levels"])
		var r_transports = [];
		
		//Loop Over Levels
		l_levels.forEach(function(i_level){
			r_transports.push({
				name 	 : i_level,
				filename : p_config["directory"] + l_levels[i_level],
				level	 : i_level
 			});
		})
		
		return r_transports;
	}
	
	//Initialize
	return _init(p_config);
}