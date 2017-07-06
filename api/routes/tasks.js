module.exports = function(router, connection) {
	var todoList = require('../controllers/tasks')(connection);
	
	// todoList Routes
	router.route('/tasks')
		.get(todoList.list_all_tasks);
		
};