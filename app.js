// THIS PAGE HANDLES ROUTES
const
	express = require("express"),
	app = express(),
	constant = require("./constants"),
	multer = require("multer"),
	gistExtractor = require("./extractor/index");

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

app.post("/case", upload.single("case"), async (req, res) => {
	console.log(req.file);
	let path = req.file.path;
	delete req.file;
	try {
		let gist = await gistExtractor(path);
		console.log("@@@", gist);
		let newCase = new Case({
			prosecution: gist.prosecution,
			caseNumber: gist.caseNumber,
			victim: gist.victim,
			penalCode: gist.penalCodes
		});
		let savedCase = await newCase.save();
		res.status(201).json(savedCase.toJSON());
	} catch (exception) {
		res.status(500).send(exception.toString());
	}

});

app.get("*", (req, res) => {
	console.log(req.connection.remoteAddress);
	res.status(404).send("<h1>Page missing!!</h1>");
});

module.exports = app;