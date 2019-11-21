const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

let caseSchema = new mongoose.Schema({
	prosecution: {
		type: String,
		// required: true
	},
	accused: {
		type: String,
		// required: true
	},
	caseNumber: {
		type: String,
		required: true,
		unique: true
	},
	penalCode: {
		type: [Number],
		required: true,
	},
	suspect: {
		type: [String],
		// required: true
	},
	victim: {
		type: [String],
		// required: true
	},
	evidence: [String],
	witness: [String]
}).set("toJSON", {
	transform: (doc, returnObject) => {
		returnObject.id = returnObject._id.toString();
		delete returnObject._id;
		delete returnObject.__v;
	}
});

caseSchema.plugin(uniqueValidator);

module.exports = mongoose.model("case", caseSchema);