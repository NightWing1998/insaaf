// THIS PAGE HANDLES ROUTES
const
	express = require("express"),
	app = express(),
	multer = require("multer"),
	gistExtractor = require("./extractor/index"),
	middleware = require("./utils/middleware"),
	intelligenceController = require("./api");

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

app.use("/api/intelligence", intelligenceController);

app.use(middleware.MongooseErrorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;