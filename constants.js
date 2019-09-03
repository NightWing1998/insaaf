require("dotenv/config");
const testString = "_TEST";
function Constant(name){
	if(process.env.NODE_ENV === 'TEST'){
		return process.env[name+testString];
	}
	return process.env[name];
}

module.exports = Constant;