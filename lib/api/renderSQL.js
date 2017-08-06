module.exports = function(p_exceptions){
	//Imports
	var fse = require('fs-extra');

	//Instance Variables
	var g_sql_dir;
	var g_conn;
	
	//Constructor
	function sqlRenderer(){
		g_sql_dir = './api/sql/';
	}
	
	//Find Placeholders in SQL File
	var _getSQLVars = function(p_sql){
		//Local Variables
		var re = /\[[A-Z_]+\]/g;
		var l_matches = p_sql.match(re);
		var r_parameters = [];
		
		//Remove Containing "[" & "]"
		l_matches.forEach(function(p_parameter){
			r_parameters.push(p_parameter.slice(1, -1));
		});
		
		return r_parameters;
	}	

	//Validate SQL Parameters
	var _resolveSQLArgs = function(p_sql, p_parameters){
		//Local Variables
		var r_parameters = {};
		
		//Loop Over Expected SQL Variables
		_getSQLVars(p_sql).forEach(function(p_para){

			//Was Parameter Provided?
			if(typeof p_parameters[p_para] !== 'undefined'){
				//Save Parameter Value
				r_parameters[p_para] = p_parameters[p_para];
			
			//Required Parameter Not Found
			}else{
				throw new p_exceptions['ValidationError']('required', 'SQL Parameter "' + p_para + '"');
			}
		});
		
		return r_parameters;
	}

	//Create Final SQL By Mapping Arguments to Their Respective Placeholders
	var _mapSQLArgs = function(p_sql, p_sql_vars){
		//Local Variables
		var l_args = _resolveSQLArgs(p_sql, p_sql_vars)
		var r_sql = p_sql;
		
		//Replace All Occurrences of Each Variable With Value
		Object.keys(l_args).forEach(function (p_key) {
			//Local Variables
			var l_regExp = new RegExp('\\[' + p_key + '\\]', "g"); 
			
			//Locate All Instances of Placeholder & Replace With Value
			r_sql = r_sql.replace(l_regExp, l_args[p_key]);
		});
		
		return r_sql;
	}
		
	var renderSQL = function(p_filename, p_sql_vars){
		//Lookup SQL & Return Promise
		return fse.readFile(g_sql_dir + p_filename + '.sql', 'utf8').then(function(p_sql){
			return _mapSQLArgs(p_sql, p_sql_vars);
		//Something Went Wrong
		}).catch(function(p_err){
			console.log(p_err);
		});	
	}	

	//Init
	sqlRenderer();
	
	//Expose renderSQLCore
	return renderSQL;
}

