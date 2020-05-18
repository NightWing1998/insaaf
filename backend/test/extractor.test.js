const
	supertest = require("supertest"),
	app = require("../app"),
	mongoose = require("mongoose"),
	Case = require("../models/case"),
	fs = require("fs"),
	constant = require("../constants");

const api = supertest(app);

const filenames = ["deepak_patil2015.txt", "gannalal_gupta.txt"];

beforeAll(() => {
	mongoose.connect(constant("DATABASE"), {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true
	});
})

describe("testing case extraction using white box testing", () => {

	beforeEach(async () => {
		// deleting all existing cases from database
		await Case.deleteMany({});
	});

	test("When case does not exist in database", async () => {
		const expectedResponse = {
			caseNumber: "283/2015",
			accused: ["Gannalal Panchgulam Gupta"],
			penalCode: [302]
		}

		const res = await api
      				.post("/api/case")
      				.attach("case",filenames[1])
      				.set("Accept", "application/json")
      				.expect(201);

		// console.log(res.body, expectedResponse);

		expect(res.body.caseNumber).toBe(expectedResponse.caseNumber);
		expect(res.body.accused[0]).toMatch(expectedResponse.accused[0]);
		expect(res.body.penalCode).toContain(expectedResponse.penalCode[0]);
	});

	test("When case exists in database",async () => {
		// const expectedResponse = {
		// 	caseNumber: "898/2015",
		// 	accused: ["Deepak Gajanan Patil"],
		// 	penalCodes: [302]
		// }

		// First inserting case in database
		await api.post("/api/case")
			.attach("case", filenames[0])
			.set('Accept', 'application/json')
			.expect(201);

		// console.log(res.body, expectedResponse);

		// Since case is already present, this request should return error
		await api.post("/api/case")
			.attach("case", filenames[0])
			.set('Accept', 'application/json')
			.expect(400);
	});
	
});

afterAll(() => {
	mongoose.connection.close();
});