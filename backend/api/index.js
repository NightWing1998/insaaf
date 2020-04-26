// THIS PAGE HANDLES ALL THE INSAAF API RELATED CONSTRAINTS
//
// REQUIRES :- digitalIPC, ALgo to find severity,database for case handling
const router = require("express").Router();
const Case = require("../models/case");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const constants = require("../constants");

const dateDiff = (date1, date2) => {
	const months = [date1.getMonth(), date2.getMonth()];
	const years = [date1.getFullYear(), date2.getFullYear()];
	let totalMonths = 0;
	if (months[0] < months[1]) {
		totalMonths += 12 - months[1] + months[0];
		years[0] -= 1;
	} else {
		totalMonths += months[0] - months[1];
	}

	totalMonths += (years[0] - years[1]) * 12;

	return totalMonths;
};

// caseData :-
/*
	means: bool | number
	motive: bool | number
	opportunity: bool | number
	time_since_petition_filed: number
	witness: for: number, against: number
	evidence: for: Object(key : data | list) against: Object(key : data | list)
*/
const predict = async (caseData) => {
	const { means, motive, opportunity, caseStart, evidence } = caseData;
	if (!caseStart || caseStart.length !== 7) {
		const err = new Error();
		err.message = `Case start (${caseStart}) is invalid`;
		err.name = "MongooseValidationError";
		throw err;
	}
	const time_since_petition_filed = dateDiff(
		new Date(),
		new Date(caseStart.split("/")[0], caseStart.split("/")[1])
	);

	return (
		await axios.post(`${constants("ML_URL")}/predict`, {
			means: means?1:0,
			motive :motive?1:0,
			opportunity: opportunity?1:0,
			time_since_petition_filed: time_since_petition_filed,
			evidence,
		})
	).data;
};

router.put("/predict/:id", async (req, res, next) => {
	const caseId = req.params.id;
	try {
		let updatedCaseFile = await Case.findByIdAndUpdate(caseId, req.body, {
			new: true,
		});
		if (updatedCaseFile === null) {
			return res.status(404).json({
				message: "Case file not found",
				error: true,
			});
		}
		// let temp = updatedCaseFile.toJSON();
		// console.log(temp);

		// Predict here
		const caseResult = (await predict(updatedCaseFile.toJSON())).result;
		const suggestion = { suggestion: caseResult };

		if (caseResult === "guilty") {
			suggestion.punishment = ["XXXXXX fine", "14 years of imprisonment"];
		}

		res.status(201).json(suggestion);

		// res.status(201).json(temp);
	} catch (exception) {
		next(exception);
	}
});

router.post("/predict", async (req, res, next) => {
	try {
		// const caseResult = await predict(req.body);
		const caseResult = await predict({
			victim: "Ganalal Gupta",
			accused: "Moinuddin Ahmed Makandar",
			penalCodes: [302],
			means: 0,
			motive: 0,
			opportunity: 0,
			evidence: {
				for: {
					oral: 0,
					documentary: 0,
					primary: 0,
					secondary: 0,
					real: 0,
					hearsay: 0,
					judicial: 0,
					non_judicial: 0,
					direct: 0,
					circumstantial: 0,
					eye_witness: 0,
					hostile_witness: 0,
					representing_witness: 0,
				},
				against: {
					oral: 0,
					documentary: 1,
					primary: 1,
					secondary: 0,
					real: 0,
					hearsay: 0,
					judicial: 0,
					non_judicial: 0,
					direct: 0,
					circumstantial: 1,
					Eye_witness: 0,
					hostile_witness: 0,
					representing_witness: 10,
				},
			},
			caseStart: "2009/10",
		});

		res.status(201).json(caseResult);
	} catch (error) {
		next(error);
	}
});

router.put("/train/:id", async (req, res, next) => {
	const caseId = req.params.id;
	try {
		let updatedCaseFile = await Case.findByIdAndUpdate(caseId, req.body, {
			new: true,
		});
		if (updatedCaseFile === null) {
			return res.status(404).json({
				message: "Case file not found",
				error: true,
			});
		}

		let temp = {
			...updatedCaseFile.toJSON(),
			time_since_petition_filed: dateDiff(
				new Date(),
				new Date(
					updatedCaseFile.caseStart.split("/")[0],
					updatedCaseFile.caseStart.split("/")[1]
				)
			),
			conclusion: updatedCaseFile.incomplete
				? "need more evidence"
				: updatedCaseFile.guilty
					? "guilty"
					: "not guilty",
			means: updatedCaseFile.means?1:0,
			motive: updatedCaseFile.motive?1:0,
			opportunity: updatedCaseFile.means?1:0
		};

		delete temp.incomplete;
		delete temp.id;

		const data = JSON.parse(
			fs.readFileSync(path.resolve(__dirname, "..", "dataset","index.json")).toString()
		).data;
		data.push(temp);

		fs.writeFileSync(
			path.resolve(__dirname, "..", "dataset","index.json"),
			JSON.stringify({ data })
		);

		const trained = (
			await axios.post(`${constants("ML_URL")}/train`, data, {
				headers: {
					"Content-Type": "application/json",
				},
			})
		).data;

		// console.log(trained);

		res.status(201).json(trained);
	} catch (error) {
		next(error);
	}
});

router.post("/train", async (req, res, next) => {
	try {
		const data = JSON.parse(
			fs.readFileSync(path.resolve(__dirname, "..", "dataset","index.json")).toString()
		).data;

		const trained = (
			await axios.post(`${constants("ML_URL")}/train`, data, {
				headers: {
					"Content-Type": "application/json",
				},
			})
		).data;

		// console.log(trained);

		res.status(201).json(trained);
	} catch (error) {
		next(error);
	}
});

router.get("/train/dataset", async (req, res, next) => {
	try {
		if (!req.query.password || req.query.password !== "1234") {
			throw new Error("Password invalid");
		}
		// console.log(path.resolve(__dirname,"..","dataset.json"),fs.readFileSync(path.resolve(__dirname,"..","dataset","index.json")).toString());
		res.download(path.resolve(__dirname, "..", "dataset","index.json"));
	} catch (e) {
		next(e);
	}
});

module.exports = router;
