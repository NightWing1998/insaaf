const
	app = require("./app"),
	http = require("http"),
	mongoose = require("mongoose"),
	constant = require("./constants"),
	// Case = require("./models/case"),
	fs = require("fs");

const mongoUri = constant("DATABASE");

let server = http.createServer(app);

server.listen(constant("PORT"), constant("IP"), async (err) => {
	if (err) throw err;
	console.log("Server started successfully on port ", constant("PORT"));
	// console.log(constant("PORT"),mongoUri,constant("DATABASE_PASSWORD"));
	let mongoConnectionOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	};
	if (!fs.existsSync("./case_files")) {
		fs.mkdirSync("./case_files");
	}
	if(!fs.existsSync("./dataset")){
		fs.mkdirSync("./dataset");
		fs.writeFileSync("./dataset/index.json", JSON.stringify({data: []}));
	}
	if (!fs.existsSync("./dataset/index.json")){
		fs.writeFileSync("./dataset/index.json",JSON.stringify({data: []}));
	}
	mongoose.connect(mongoUri, mongoConnectionOptions,
		(dbErr) => {
			if (dbErr) console.log(mongoUri, dbErr);
			else console.log("Connected to database ", mongoUri);
			// if(constant("NODE_ENV") !== "PRODUCTION"){
			// 	Case.deleteMany({}).then(res => console.log("Cleared Cases", res));
			// }
		}
	);
});
