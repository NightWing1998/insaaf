// THIS PAGE HANDLES ROUTES
const
	express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	constant = require("./constants"),
	multer = require("multer"),
	gistExtractor = require("./extractor/index"),
	fs = require("fs");

const mongoUri = constant("DATABASE");

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
	let {
		apellant,
		respondent,
		caseNumber,
		penalCode,
		suspect,
		evidence,
		witness
	} = req.body;
	console.log(req.file);
	let path = req.file.path;
	delete req.file;
	// penalCode = penalCode.split(",").map(Number);
	// suspect = suspect.split(",");
	// evidence = typeof evidence !== 'undefined' ? evidence.split(",") : [""];
	// witness = typeof witness !== 'undefined' ? witness.split(",") : [""];
	// console.log("!", apellant, "@", respondent, "#", caseNumber, "$", penalCode, "%", suspect, "^", evidence, "&", witness);
	let gist = await gistExtractor(path);
	console.log("@@@", gist);
	res.status(201).json({
		message: "gist created"
	});
	// Case.create({
	// 	apellant,
	// 	respondent,
	// 	caseNumber,
	// 	penalCode,
	// 	suspect,
	// 	witness,
	// 	evidence
	// }, (err, response) => {
	// 	if (err) res.status(500).json(err)
	// 	else res.status(201).json(response);
	// });
});

app.get("*", (req, res) => {
	console.log(req.connection.remoteAddress);
	res.status(404).send("<h1>Page missing!!</h1>");
});

app.listen(constant("PORT"), constant("IP"), async (err) => {
	if (err) throw err;
	console.log("Server started successfully on port ", constant("PORT"));
	// console.log(constant("PORT"),mongoUri,constant("DATABASE_PASSWORD"));
	let mongoConnectionOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	};
	mongoose.connect(mongoUri, mongoConnectionOptions,
		(dbErr) => {
			if (dbErr) console.log(dbErr);
			else console.log("Connected to database ", mongoUri);
		}
	);
});