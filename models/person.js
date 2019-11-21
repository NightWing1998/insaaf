const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

let personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	uuid: { // Aadhar id
		type: Number,
		required: true,
		unique: true
	},
	age: Number,
	pastRecord: [Number] // Case numbers
}).set("toJSON", {
	transform: (doc, returnObject) => {
		returnObject.id = returnObject._id.toString();
		delete returnObject._id;
		delete returnObject.__v;
	}
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model("case", personSchema);