const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// const medicalCertificates = ["injury","discharge papers of victim","discharge papers of suspect","mental fitness","physical fitness"];
// const forensicReports = ["post mortem","blood on clothes","fingerprint analysis"];
// const electronicRecords = ["images","call records","audio clips","video clips","cctv","GPS","digital footprint","storage devices","phones"];

const evidenceSchema = new mongoose.Schema({
	oral: {
		type: Number,
		default: 0
	},
	documentary: {
		type: Number,
		default: 0
	},
	primary: {
		type: Number,
		default: 0
	},
	secondary: {
		type: Number,
		default: 0
	},
	real: {
		type: Number,
		default: 0
	},
	hearsay: {
		type: Number,
		default: 0
	},
	judicial: {
		type: Number,
		default: 0
	},
	non_judicial: {
		type: Number,
		default: 0
	},
	direct: {
		type: Number,
		default: 0
	},
	circumstantial: {
		type: Number,
		default: 0
	},
	eye_witness: {
		type: Number,
		default: 0
	},
	hostile_witness: {
		type: Number,
		default: 0
	},
	representing_witness: {
		type: Number,
		default: 0
	}
}).set("toJSON",{
	transform: (doc, returnDoc) => {
		delete returnDoc._id;
		delete returnDoc.__v;
	}
});

const defaultEvidenceObject = {
	oral: 0,
	documentary: 0,
	primary: 0,
	secondary: 0,
	real: 0,
	hearsay: 0,
	judicial: 0,
	non_judicial: 0,
	direct: 0,
	circumstantial:0,
	eye_witness: 0,
	hostile_witness: 0,
	representing_witness: 0
};

let caseSchema = new mongoose.Schema({
	prosecution: [{
		type: String,
		required: true
	}],
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
		for: {
			type: evidenceSchema,
			required: true,
			default: defaultEvidenceObject
		},
		against: {
			type: evidenceSchema,
			required: true,
			default: defaultEvidenceObject
		}
	},
	motive: {
		type: Boolean,
		default: false
	},
	means: {
		type: Boolean,
		default: false
	},
	opportunity: {
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
		maxlength: 7,
		default: "0000/00"
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