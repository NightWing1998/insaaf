// THIS PAGE HANDLES ROUTES
const
	express = require("express"),
	app = express(),
	multer = require("multer"),
	gistExtractor = require("./extractor/index"),
	middleware = require("./utils/middleware"),
	fs = require("fs"),
	axios = require("axios"),
	constants = require("./constants");

const Case = require("./models/case");

const caseFilterer = (req, file, callback) => {
	if (file.mimetype !== "application/pdf" || file.mimetype !== "text/plain") {
		callback(null, false);
	}
	callback(null, true);
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'case_files/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
});

const upload = multer({
	fileFilter: caseFilterer,
	storage: storage
});

app.use(express.urlencoded({
	extended: false
}));
app.use(express.json({}));
// app.use(upload.array());

app.use(middleware.requestLogger);

app.post("/api/case", upload.single("case"), async (req, res, next) => {
	let path = req.file.path;
	delete req.file;
	try {
		let gist = await gistExtractor(path);
		let newCase = new Case({
			prosecution: gist.prosecution,
			caseNumber: gist.caseNumber,
			victim: gist.victim,
			penalCode: gist.penalCodes,
			accused: gist.accused
		});
		let savedCase = await newCase.save();
		res.status(201).json(savedCase.toJSON());
	} catch (exception) {
		next(exception);
	}

});

// app.post("/api/case/force", async (req, res, next) => {
// 	try {
// 		let newCase = new Case(req.body);
// 		let savedCase = await newCase.save();
// 		res.status(201).json(savedCase.toJSON());
// 	} catch (exception) {
// 		next(exception);
// 	}

// });

app.get("/api/case", async (req, res, next) => {
	try {
		const cases = await Case.find({});
		res.status(200).json({
			cases
		});
	} catch (e) {
		next(e);
	}
});

app.get("/api/case/:id", async (req, res, next) => {
	const id = req.params.id;
	try {
		const caseFile = (await Case.findById(id)).toJSON();
		res.status(200).json(caseFile);
	} catch (e) {
		next(e);
	}
});

app.put("/api/case/:id", async (req, res, next) => {
	const caseId = req.params.id;
	try {
		let updatedCaseFile = await Case.findByIdAndUpdate(caseId, req.body, {
			new: true
		});
		let temp = updatedCaseFile.toJSON()
		console.log(temp);
		res.status(201).json(temp);
	} catch (exception) {
		next(exception);
	}

});

app.delete("/api/case/:id", async (req, res, next) => {
	const caseid = req.params.id;
	try {
		await Case.findByIdAndDelete(caseid);
		res.status(204).end();
	} catch (e) {
		next(e);
	}
});

app.get("/api/train", async (req, res, next) => {
	try {
		const cases = await Case.find({});
		let csvTypes = new Set();
		cases.forEach(c => {
			c.evidence.for.forEach(ef => {
				if (ef !== "") {
					csvTypes.add(ef.toLowerCase().replace(".", "").replace(" ", "_"))
				}
			});
			c.evidence.against.forEach(ea => {
				if (ea !== "") {
					csvTypes.add(ea.toLowerCase().replace(".", "").replace(" ", "_"))
				}
			});
		});
		let inputData = "",
			outputData = "";
		cases.forEach(c => {
			inputData += c.means ? "1," : "0,";
			inputData += c.motive ? "1," : "0,";
			inputData += c.oppurtunity ? "1," : "0,";
			inputData += c.witness.for ? c.witness.for.toString() + "," : "0,";
			inputData += c.witness.against ? c.witness.against.toString() + "," : "0,";
			csvTypes.forEach(ct => {
				if (c.evidence.for.find(e => e.toLowerCase().replace(".", "").replace(" ", "_") === ct)) {
					inputData += "1,";
				} else if (c.evidence.against.find(e => e.toLowerCase().replace(".", "").replace(" ", "_") === ct)) {
					inputData += "-1,";
				} else {
					inputData += "0,";
				}
			});
			inputData += "\n";
			outputData += `${c.guilty & !c.incomplete? 1:0},${c.incomplete?1:0},${c.guilty || c.incomplete?0:1}\n`;
		});
		const ML_URL = constants("ML_URL");
		return (await axios.post(`${ML_URL}/train`, {
			inputData,
			outputData
		})).data;

	} catch (e) {
		next(e);
	}
});

app.get("/api/file", async (req, res, next) => {
	try {
		const cases = await Case.find({});
		let csvTypes = new Set();
		cases.forEach(c => {
			c.evidence.for.forEach(ef => {
				if (ef !== "") {
					csvTypes.add(ef.toLowerCase().replace(".", "").replace(" ", "_"))
				}
			});
			c.evidence.against.forEach(ea => {
				if (ea !== "") {
					csvTypes.add(ea.toLowerCase().replace(".", "").replace(" ", "_"))
				}
			});
		});
		let csvFile = "";
		csvFile += "means,motive,oppurtunity,witnessFor,witnessAgainst";
		let temp = [...csvTypes.values()];
		// console.log(temp.join(","));
		if (temp.length !== 0) {
			csvFile += "," + temp.join(",")
		}
		csvFile += ",guilty\n";
		cases.forEach(c => {
			csvFile += c.means ? "1," : "0,";
			csvFile += c.motive ? "1," : "0,";
			csvFile += c.oppurtunity ? "1," : "0,";
			csvFile += c.witness.for ? c.witness.for.toString() + "," : "0,";
			csvFile += c.witness.against ? c.witness.against.toString() + "," : "0,";
			// console.log(c.evidence.for, c.evidence.against);
			csvTypes.forEach(ct => {
				if (c.evidence.for.find(e => e.toLowerCase().replace(".", "").replace(" ", "_") === ct)) {
					csvFile += "1,";
				} else if (c.evidence.against.find(e => e.toLowerCase().replace(".", "").replace(" ", "_") === ct)) {
					csvFile += "-1,";
				} else {
					csvFile += "0,";
				}
			});
			csvFile += c.guilty ? "1\n" : "0\n";
		});
		fs.writeFileSync("./train.csv", csvFile);
		res.download("./train.csv");
		// res.send(csvFile);
	} catch (e) {
		next(e);
	}
});

app.use(middleware.MongooseErrorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;