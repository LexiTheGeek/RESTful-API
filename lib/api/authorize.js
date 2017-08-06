//Authorize API Requests Before Running
module.exports = function(p_url, p_config, p_exceptions){
	
	//Libraries
	var merge = require('merge');
	var requestPromise  = require('request-promise');
	var jsend = require('jsend');
	var cache = require('./cache.js');
	
	//Instance Variables
	var g_config, g_exceptions, g_end_point, g_cache;
	
	//Constructor
	var _init = function(p_url, p_config, p_exceptions){		
		g_config = p_config; 
		g_exceptions = p_exceptions;
		g_end_point = p_url; //Set Auth REST URI
		g_cache = cache(p_config.cache()); //Create Cache
	}
	
	//Convert Cookie Object to String
	var _toCookieString = function(p_cookie_obj){
		//Local Variables
		var r_cookies = [];
		
		//Can Be Converted
		if(typeof p_cookie_obj === 'object'){
			
			//Build Key/Val Pairs
			Object.keys(p_cookie_obj).forEach(function(p_key) {
				r_cookies.push(p_key + '=' + p_cookie_obj[p_key])
			});
			
			//Combine Into Cookie
			r_cookies = r_cookies.join("; ");

		};
		
		return r_cookies;
	}
	
	//Format Authorization Response
	var _formatAuthResponse = function(p_acl, p_user_id, p_logged_in, p_has_access){
		return {
			"userID"	: p_user_id,
			"loggedIn" 	: p_logged_in,
			"acl"		: {
				"code"		: p_acl,
				"hasAccess"	: p_has_access
			}
		};	
	}
	
	//Ensure That Key Is Valid (Converts 'module.task' to 'module-task')
	var _toCacheKey = function(p_key){
		return  p_key.replace(new RegExp('\.', 'g'), '-');
	}
	
	//Handle Response From Auth End Point
	var _cacheAuthResponse = function(p_acl, p_resp){
		
		//Local Variables
		var l_cache;
		
		//Logged In
		if(p_resp.loggedIn){
			
			//Cache is Enabled
			if( g_config.cache().auth.enabled ){
				
				//UserID Was Not Returned From Auth End Point
				if(p_resp.userID === 'undefined'){
					throw new g_exceptions["ValidationError"]('required', 'UserID', '. Auth End Point Must Return userID to Use Caching.');
				
				//UserID Provided
				}else{
					//Update Cache
					l_cache = g_cache.get(p_resp.userID, 'auth');
					l_cache.set(_toCacheKey(p_acl), p_resp, l_cache.getTtl());     
				}	
			}
		//Not Logged In
		}else if( g_config.cache().auth.enabled ){
			g_cache.destroy(p_resp.userID);
		}
	}
	
	//Handle Response From Auth End Point
	var _createResponse = function(p_acl, p_resp){
		//Local Variables
		var l_resp = JSON.parse(p_resp);
		
		//Create Response
		l_resp = _formatAuthResponse(p_acl, l_resp["userID"], l_resp["loggedIn"], l_resp["hasAccess"]);
		
		//Cache Our Response
		_cacheAuthResponse(p_acl, l_resp);
			
		//Determine Authorization Status
		return 	l_resp.loggedIn && l_resp.acl.hasAccess	? jsend.success(l_resp)
														: jsend.fail(l_resp);
	}
	
	//Run Authorization Request
	var run = function(p_cookies, p_acl){
	
		//Check Permissions
		return requestPromise({
			url : g_end_point + '?acl=' + p_acl,
			headers: {
				Cookie : _toCookieString(p_cookies)
			}
		
		//Parse Response (Returns Parsed Response to Caller)
		}).then(function(p_resp){
			return new Promise(function(resolve, reject){
				resolve	(  _createResponse(	p_acl, 
											p_resp)  
						);
			})
					
		}).catch(function(err){
			console.log(err);
		});
		
	}
	
	//Init
	_init(p_url, p_config, p_exceptions);
	
	//Expose Run
	return run;
}