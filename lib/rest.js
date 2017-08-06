module.exports = function (p_settingsDir){
		
	//Includes
	var express = require("express");
	var app  = express();
	var bodyParser  = require("body-parser");
	var cookieParser = require('cookie-parser');
	var jsend = require('jsend');
	var mysql   = require("mysql");
	var dir 	= require('node-dir');

	//Custom Includes
	var api = require('./api.js');
	var config = require('./config.js');
	var exceptions = require('./exceptions.js');
	var logger = require('./logger.js');

	//Rest Server
	var REST_SERVER = function(p_settingsDir){
		
		//Constructor
		var init = function(p_settingsDir){
			//Local Variables
			var l_config = config(p_settingsDir, ['settings', 'tasks'], ['permissions', 'exceptions', 'logging', 'mysql', 'cache']);
			var l_options = {
				"config"	 : l_config,
				"exceptions" : exceptions(l_config.exceptions()),
				"logger"	 : logger(l_config.logging()),
				"mysql"		 : configureMySQL(l_config.mysql())
			}
			
			//Attempt to Start Server
			try{
				//Configure Server
				configureExpress(l_options);
				
				//Start Server
				start();
			
			//Something Went Wrong With Initialization
			}catch(p_err){
				stop(p_err);
			}
		}
		
		//Get MySQL Connection Pool
		var configureMySQL = function(p_mysql_config){
			//Local Variables
			var l_databases = Object.keys(p_mysql_config);
			var r_pool = {};
			
			//Loop Over Configurations
			l_databases.forEach(function(i_db){
				r_pool[i_db] = mysql.createPool(p_mysql_config[i_db]);
				
				//Throws Error if MySQL is Invalid
				validateMySQL(r_pool[i_db]);
			});
	
			return r_pool;
		}
		
		//Validate MySQL Connection
		var validateMySQL = function(p_pool){
			p_pool.getConnection(function(err,connection){
				if(err) {
					throw err;
				}else{
					connection.release();
				}
			});
		}
		
		//Configure Express App
		var configureExpress = function(p_options){
			//Local Variables
			var l_router = express.Router();
			var l_api = api(p_options);
			
			//Express Configuration
			app.use(bodyParser.urlencoded({ extended: true }));
			app.use(bodyParser.json());
			app.use(cookieParser());
			app.use(jsend.middleware)
			app.use('/api', l_router);
			  
			//Create Rest Router
			configureRoutes(l_router, l_api);
		}
		
		//Configure Express Routes
		var configureRoutes = function(p_router, p_api){
			//Local Variables
			var files = dir.files('./api/routes', {sync:true});
			var l_routes = [];
			
			//Load All Routing Files in Dir
			files.forEach(function(e, i){
				l_routes.push(
					require(
						'../' + e.slice(0, -3).replace(/\\/g, '/')
					)
				)
			})
			
			//Init Each Route File
			l_routes.forEach(function(p_route){
				p_route(p_router, p_api);
			});
		}
		
		//Start Server
		var start = function(){
			app.listen(3000,function(){
				console.log("All right ! I am alive at Port 3000.");
			});
		}
		
		//Stop Server
		var stop = function(p_err){
			//Log Error
			console.log(p_err);
			
			//Stop Server
			process.exit(1);
		}
		
		//Call Constructor
		init(p_settingsDir);
	}
	
	//Expose
	return REST_SERVER(p_settingsDir);
}