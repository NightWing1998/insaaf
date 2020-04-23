const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let ipcSchema = new mongoose.Schema({
	penalCode: {
		type: Number,
		required: true,
		unique: true
	},
	keyword: [String],
	penaltyArray: [String]
}).set("toJSON", {
	transform: (doc, returnObject) => {
		returnObject.id = returnObject._id.toString();
		delete returnObject._id;
		delete returnObject.__v;
	}
});

ipcSchema.plugin(uniqueValidator);

module.exports = mongoose.model("case", ipcSchema);