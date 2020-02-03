require("dotenv/config");
const envString = "_" + process.env.NODE_ENV;

function Constant(name) {
	if (process.env.NODE_ENV !== "PRODUCTION") {
		return process.env[name + envString];
	}
	return process.env[name];
}

module.exports = Constant;