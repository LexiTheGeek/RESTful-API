module.exports = function(p_connection){
	//Global Variables
	var g_conn = p_connection; //Save DB Connection
	
	//Controllers
	var list_all_tasks = function(req, res) {
		res.json({"Error" : false, "Message" : "1"});
	};

	//Expose Controllers
	return {
		list_all_tasks	:	list_all_tasks
	}
}

