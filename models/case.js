const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

let caseSchema = new mongoose.Schema({
	apellant: {
		type: String,
		required: true
	},
	respondent: {
		type: String,
		required: true
	},
	caseNumber: {
		type: Number,
		required: true,
		unique: true
	},
	penalCode: {
		type: [Number],
		required: true,
	},
	suspect: {
		type: [String],
		required: true
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

let caseModel = mongoose.model("case", caseSchema);

class Case {
	static create(caseDetails, callback) {
		let c = new caseModel(caseDetails);
		c.save()
			.then(res => {
				callback(undefined, res.toJSON());
			})
			.catch(err => {
				callback(err, undefined);
			});
	}
}
// constructor(db){
// 	this.collection = db.collection("case");
// }
// async createCase(caseFeatures,callback){
// 	this.collection.insert(caseFeatures,(err,res)=>{
// 		if(err) throw err;
// 		console.log(res);
// 	});
// }

module.exports = Case;