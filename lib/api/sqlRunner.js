module.exports = function(p_conn, p_exceptions){
	//Includes
	var renderSQL = require('./renderSQL.js');
	
	//Instance Variables
	var g_conn, sqlRenderer;
	
	//Constructor
	var sqlRunner = function (p_conn){
		g_conn = p_conn;
		sqlRenderer = new renderSQL(p_exceptions)
	}
	
	//Run SQL File
	var run = function(p_db_alias, p_filename, p_sql_vars){
		return sqlRenderer(p_filename, p_sql_vars)
				.then(	function(p_query){
							//Return Deffered Object
							return new Promise(function(p_resolve, p_reject){
								//Run Query
								g_conn[p_db_alias].query(p_query, function (p_err, p_rows, p_fields){
									
									//If Query Error
									if (p_err) {
										return p_reject(p_err);
									}
									
									//Query Success
									p_resolve(p_rows, p_fields);
								})
							});
				});
	}
	
	//Init
	sqlRunner(p_conn);
	
	return run;
}