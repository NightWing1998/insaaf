// THIS PAGE HANDLES ALL THE INSAAF API RELATED CONSTRAINTS
// 
// REQUIRES :- digitalIPC, ALgo to find severity,database for case handling
const router = require("express").Router();
const Case = require("../models/case");
const axios = require("axios");
const constants = require("../constants");

const predict = () => { };

router.put("/predict/:id", async (req, res, next) => {
	const caseId = req.params.id;
	try {
		let updatedCaseFile = await Case.findByIdAndUpdate(caseId, req.body, {
			new: true
		});
		let temp = updatedCaseFile.toJSON();
		console.log(temp);

		// Predict here
		predict();

		res.status(200).json({
			"predict": "predict"
		});

		res.status(201).json(temp);
	} catch (exception) {
		next(exception);
	}
});

router.post("/predict", async (req, res, next) => {
	try {

		predict();

		res.status(200).json({
			"predict": "predict"
		});

	} catch (error) {
		next(error);
	}
});

router.post("/train", async (req, res, next) => {
	try {
		res.status(200).json({
			"accuracy": "90%"
		})
	} catch (error) {
		next(error)
	}
});

router.get("/train/dataset", async (req, res, next) => {
	try {
		fs.writeFileSync("./train.csv", "");
		res.download("./train.csv");
	} catch (e) {
		next(e);
	}
});

module.exports = router;