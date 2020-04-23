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
	const months = [date1.getMonth(),date2.getMonth()];
	const years = [date1.getFullYear(), date2.getFullYear()];
	let totalMonths = 0;
	if(months[0] < months[1]){
		totalMonths += 12 - months[1] + months[0];
		years[0] -= 1;
	} else {
		totalMonths += (months[0] - months[1]);
	}

	totalMonths += (years[0] - years[1])*12;

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
	const {means, motive, opportunity, caseStart, witness, evidence} = caseData;
	if(!caseStart || caseStart.length !== 7){
		throw new Error(`case start year(${caseStart}) is invalid`);
	}
	const time_since_petition_filed = dateDiff(new Date(),new Date(caseStart.split("/")[0],caseStart.split("/")[1]));
	console.log(time_since_petition_filed);

	return (await axios.post(`${constants("ML_URL")}/predict`,{
		means, motive, opportunity,
		time_since_petition_filed: 101,
		witness, evidence
	})).data;
};

router.put("/predict/:id", async (req, res, next) => {
	const caseId = req.params.id;
	try {
		let updatedCaseFile = await Case.findByIdAndUpdate(caseId, req.body, {
			new: true
		});
		let temp = updatedCaseFile.toJSON();
		console.log(temp);

		// Predict here
		const caseResult = await predict(updatedCaseFile.toJSON());

		res.status(201).json(caseResult);

		// res.status(201).json(temp);
	} catch (exception) {
		next(exception);
	}
});

router.post("/predict", async (req, res, next) => {
	try {

		// const caseResult = await predict(req.body);
		const caseResult = await predict({
			"victim": "Vinay",
			"accused": "Sachin Khanna",
			"penalCodes": [
				302
			],
			"means": 1,
			"motive": 0,
			"opportunity": 1,
			"evidence": {
				"for": {},
				"against": {
					"murder_weapon": "bat",
					"forensic_reports": [
						"ct scan",
						"post mortem",
						"blood stained clothes"
					],
					"dying_declaration": true
				}
			},
			"witness": {
				"for": 0,
				"against": 10
			},
			"caseStart": "2009/03"
		});

		res.status(201).json(caseResult);

	} catch (error) {
		next(error);
	}
});

router.post("/train", async (req, res, next) => {
	try {

		const data = JSON.parse(fs.readFileSync(path.resolve(__dirname,"..","dataset.json")).toString()).data;

		const trained = (await axios.post(`${constants("ML_URL")}/train`,data,{
			headers: {
				"Content-Type":"application/json"
			}
		})).data;

		console.log(trained);

		res.status(201).json(trained);
	} catch (error) {
		next(error);
	}
});

router.get("/train/dataset", async (req, res, next) => {
	try {

		if(!req.query.password || req.query.password !== "1234"){
			throw new Error("Password invalid");
		}
		// console.log(path.resolve(__dirname,"..","dataset.json"),fs.readFileSync(path.resolve(__dirname,"..","dataset.json")).toString());
		res.download(path.resolve(__dirname,"..","dataset.json"));
	} catch (e) {
		next(e);
	}
});

module.exports = router;