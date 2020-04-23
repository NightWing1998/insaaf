const
	supertest = require("supertest"),
	app = require("../app"),
	mongoose = require("mongoose"),
	Case = require("../models/case");

const api = supertest(app);

const filenames = ["azad_ansare2012.pdf", "deepak_patil2015.pdf", "gannalal_gupta.pdf", "jitendrakumar_shahu2012.pdf", "nasimbano_sayyed2012.pdf"];

describe("testing case extraction", () => {

	beforeEach(async () => {
		await Case.deleteMany({});
	});

	test("posting each case /case", async () => {
		await api.post("/case", {
			filenames
		});
	});
	
});

afterAll(() => {
	mongoose.connection.close();
});