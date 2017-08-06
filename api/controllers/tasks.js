//Note: Unhandled exceptions will be caught in lib/api

module.exports = function(p_sqlRunner, p_config, p_exceptions, p_logger){
	
	//Global Variables
	var g_sqlRunner = p_sqlRunner; //Save DB Connection
	
	//Controllers
	var list_all_tasks = function(req, res) {
		//Local Variables
		var l_settings = p_config["list_all_tasks"];
	
		//Run SQL
		g_sqlRunner	(	'openSRS',
						'create_one_meet_appt', 
						{	"START_DATE" : req.query.start,
							"END_DATE" 	 : req.query.end,
							"UPDATE_ID"	 : l_settings.default_id	}
		
		//Query Ran Successfully
		).then(function(p_results, p_fields){
			//Response - Meeting Created
			res.jsend.success({"message" : "Meeting Created"});
		});
		
		
	};

	//Expose Controllers
	return {
		list_all_tasks	:	list_all_tasks
	}
}


	