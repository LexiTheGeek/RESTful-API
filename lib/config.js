module.exports = function (p_configDir, p_keyedFiles, p_nonkeyedFiles){
	//Includes
	var fs = require("fs");
	var clone = require("clone");
	var merge = require('merge');
	
	//Instance Variables
	var g_dir, g_files, g_ext;
	
	//Constructor
	var _init = function(p_configDir, p_keyedFiles = [], p_nonkeyedFiles = []){
		//Local Variables
		var l_files = p_keyedFiles.concat(p_nonkeyedFiles);
	
		//Save Parameters
		g_dir = p_configDir;
		g_files = {};
		g_keyedFiles = p_keyedFiles
		g_nonkeyedFiles = p_nonkeyedFiles;
		g_ext = 'json'; 

		//Load Files
		l_files.forEach(function(p_filename){
			g_files[p_filename] = JSON.parse(fs.readFileSync(g_dir +  p_filename + '.' + g_ext, "utf8"))
		});
	}
	
	//Get Config
	var _get = function(p_which){
		return clone(g_files[p_which]); //Returns Copy So That Original Cannot Be Altered
	}
	
	//Get Key-Value From Config
	var _getKey = function(p_which, p_key){
		var l_keys = p_key.split('.');
		var r_config = g_files[p_which];
		
		//Find Key
		l_keys.forEach(function(i_key){
			//Is Object
			if(typeof r_config === 'object'){
				//Get Key
				r_config = r_config[i_key];
			
			//Function Returns Undefined If Key Not Found
			}else{
				r_config = undefined;
			}
		})
		
		return clone(r_config); //Returns Copy So That Original Cannot Be Altered
	}
	
	//Constructor For File Getter
	var _fileGetter = function(p_file){		
		return function(){
			return _get(p_file);
		}
	}
	
	//Constructor For File Getter
	var _keyGetter = function(p_file){		
		return function(p_key){
			return _getKey(p_file, p_key);
		}
	}
	
	//Factory Function (Create fileGetters & keyGetters) 
	var _build = function(p_files, p_func){
		//Local Variables
		var r_api = {};
		var l_methodName;
		
		//Create Getters For Each File
		p_files.forEach(function(p_filename){
			//Create Method
			r_api[p_filename] = p_func(p_filename);
		})
		
		//Return Methods
		return r_api;
	}
	
	//Build Getters
	var _buildFileGetters = function(){
		return _build(g_nonkeyedFiles, _fileGetter);
	}
	
	//Build keyGetters
	var _buildKeyGetters = function(){
		return _build(g_keyedFiles, _keyGetter);
	}
	
	//Api For This Module
	var api = function(){
		return merge(_buildFileGetters(), _buildKeyGetters(), {"dir" : dir})
	}
	
	//Return Config Dir
	var dir = function(){
		return g_dir;
	}

	//Initialize
	_init(p_configDir, p_keyedFiles, p_nonkeyedFiles)
	
	//Expose
	return api();
}