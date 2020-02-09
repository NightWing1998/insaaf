// THIS PAGE HANDLES ROUTES
const
	express = require("express"),
	app = express(),
	multer = require("multer"),
	gistExtractor = require("./extractor/index"),
	middleware = require("./utils/middleware");

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

app.put("/api/case/:id", async (req, res, next) => {
	const caseId = req.params.id;
	try {
		const caseFile = await Case.findById(caseId);
		let updatedCaseFile = caseFile.toJSON();
		const {
			prosecution,
			caseNumber,
			victim,
			penalCode,
			accused
		} = req.body;
		if (prosecution) {
			updatedCaseFile["prosecution"] = prosecution;
		}
		if (caseNumber) {
			updatedCaseFile["caseNumber"] = caseNumber;
		}
		if (victim) {
			updatedCaseFile["victim"] = victim;
		}
		if (penalCode) {
			updatedCaseFile["penalCode"] = penalCode;
		}
		if (accused) {
			updatedCaseFile["accused"] = accused;
		}
		caseFile.update(updatedCaseFile);
		res.status(201).json(caseFile.toJSON());
	} catch (exception) {
		next(exception);
	}

});

app.use(middleware.MongooseErrorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;