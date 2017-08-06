module.exports = (function(){

	//Object Has Required Keys/Datatypes
	var conforms = function(p_obj, p_matches){
		//Local Variables
		var l_reqKeys = Object.keys(p_matches);
		var i_counter = 0;
		var r_isValid = true;
		
		//Has Required Keys & Datatypes
		while(i_counter < l_reqKeys.length && r_isValid){
			r_isValid = p_obj.hasOwnProperty(l_reqKeys[i_counter]) && (p_matches[l_reqKeys[i_counter]] = 'any' || typeof p_obj[l_reqKeys[i_counter]] === p_matches[l_reqKeys[i_counter]]);
			i_counter++;
		}
		
		return r_isValid;
	}
		
	//Lookup Information in data
	var get = function(p_data, p_taskName, p_delimiter = '.'){
		
		//Local Variables
		var l_taskName = p_taskName.split(p_delimiter);		
		var l_error = false;
		var i_counter = 0;
		var r_result = p_data; 
		
		//Loop Over Task Name
		while(i_counter < l_taskName.length && !l_error){
			if(typeof r_result !== 'object'){
				l_error = true;
			}else{
				r_result = r_result[l_taskName[i_counter++]]
			}
		}
	
		//There was a problem (Flag It)
		if(l_error){
			r_result = undefined;
		}
		
		//Return Field
		return r_result;
	}
	
	return {
		get 	: get,
		conforms: conforms
	}
})()