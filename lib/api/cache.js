module.exports = function(p_config){
	
	//Imports
	var nodeCache = require( "node-cache" ); 
	
	//Instance Variables
	var g_config, g_cache, g_cacheSettings;
	
	//Constructor
	var _init = function(p_config){
		
		//Set Instance Vars
		g_config = p_config;
		g_cacheSettings = {};
		g_cache = {};
	
		//Normalize Cache Settings
		g_cacheSettings['auth'] = _calcCacheSettings('auth');
		g_cacheSettings['tasks'] = _calcCacheSettings('tasks');
	}
	
	//Normalize Cache Settings
	var _calcCacheSettings = function(p_which){
		//Local Variables
		var l_allowed = ['stdTTL', 'checkperiod', 'errorOnMissing'];
		var r_settings;
		
		//Find Settings
		switch(p_which.toUpperCase()){
			case 'AUTH' :
				r_settings = g_config.auth;
				break;
			case 'TASKS' :
				r_settings = g_config.auth;
				break;
		}
		
		//Remove illegal Settings
		Object.keys(r_settings).forEach(function(i_option){
			if(! l_allowed.indexOf(i_option)){
				delete r_settings[i_option];
			}
		});
		
		//Don't Use Clones (Safe Because Developer Does Not Have Direct Access to Cache)
		r_settings['useClones'] = false;
		
		return r_settings;
	}
	
	
	//Get Cache Settings
	var _cacheSettings = function(p_which){
		return g_cacheSettings[p_which.toLowerCase()];
	}
	
	//Create Cache For User
	var _userCache = function(p_userID){
		this.auth  = new nodeCache( _cacheSettings('auth') );
		this.tasks = new nodeCache( _cacheSettings('tasks') );
	};
	
	//User Has a Cache
	var _hasCache = function(p_userID){
		return typeof g_cache[p_userID] !== 'undefined';
	}

	//Get a User's Cache
	var get = function(p_userID, p_which){
		
		//User Does Not Have Cache, Create One
		if(! _hasCache(p_userID)){
			g_cache[p_userID] = new _userCache(p_userID);	
		}
		
		//Return Cache	
		return g_cache[p_userID][p_which];
	}
	
	//Destory Cache
	var _destroyCache = function(p_cache){
		p_cache.flushAll();
		p_cache.close();
	}
	
	//Destory User Cache
	var destroy = function(p_userID){
		//Local Variables
		var l_cache = g_cache[p_userID];
		
		//Flush & Close Both Caches
		_destroyCache(l_cache.auth);
		_destroyCache(l_cache.tasks);
		
		//Delete Container
		delete g_cache[p_userID];
	}
	
	//Call Constructor
	_init(p_config);
	
	return {
		get 	: get,
		destroy : destroy
	};
}
	