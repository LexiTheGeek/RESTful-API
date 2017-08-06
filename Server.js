//Includes
var REST_SERVER = require('./lib/rest.js');

//Start Server
new REST_SERVER('./config/');

//Server Core:
	//Change Cache Key From User ID to Hashed/Truncated cookie string? Or Simmilar
	
	//Caching Tasks (Means Moving Cache's Home to lib/API)
	//Caching Auth (Read From Cache)
	//Make Auth use POST
	//Rename Authorize to Authenticate
	//Pipe Updated Cookies Back To Browser
	
	
//Application Code
	//Make list_all_tasks return data on new meeting
	//Rename tasks.js
