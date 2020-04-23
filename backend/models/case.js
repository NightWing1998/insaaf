const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const medicalCertificates = ["injury","discharge papers of victim","discharge papers of suspect","mental fitness","physical fitness"];
const forensicReports = ["post mortem","blood on clothes","fingerprint analysis"];
const electronicRecords = ["images","call records","audio clips","video clips","cctv","GPS","digital footprint","storage devices","phones"];

const evidenceSchema = new mongoose.Schema({
	medical_certificates: [{
		type: String,
		enum: medicalCertificates
	}],
	forensic_reports: [{
		type: String,
		enum: forensicReports
	}],
	electronic_records: [{
		type: String,
		enum: electronicRecords
	}],
	dying_declaration: Boolean,
	murder_weapon: String
});

let caseSchema = new mongoose.Schema({
	prosecution: {
		type: String,
		required: true
	},
	accused: [{
		type: String,
		required: true
	}],
	caseNumber: {
		type: String,
		required: true,
		unique: true
	},
	penalCode: [{
		type: Number,
		required: true,
	}],
	victim: [{
		type: String,
		// required: true
	}],
	evidence: {
		for: evidenceSchema,
		against: evidenceSchema
	},
	witness: {
		for: Number,
		against: Number
	},
	motive: {
		type: Boolean,
		default: false
	},
	means: {
		type: Boolean,
		default: false
	},
	oppurtunity: {
		type: Boolean,
		default: false
	},
	guilty: {
		type: Boolean,
		default: false
	},
	incomplete: {
		type: Boolean,
		default: true
	},
	caseStart: {
		type: String,
		minlength: 7,
		maxlength: 7
	}
}).set("toJSON", {
	transform: (doc, returnObject) => {
		returnObject.id = returnObject._id.toString();
		delete returnObject._id;
		delete returnObject.__v;
	}
});

caseSchema.plugin(uniqueValidator);

module.exports = mongoose.model("case", caseSchema);