module.exports = function(router, api) {
	
	// todoList Routes
	router.route('/tasks')
		.get(function (req, res){			
			api('todoList.list_all_tasks', req, res);	
		});
		
};


