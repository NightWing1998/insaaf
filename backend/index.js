const
	app = require("./app"),
	http = require("http"),
	mongoose = require("mongoose"),
	constant = require("./constants"),
	Case = require("./models/case");

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
	mongoose.connect(mongoUri, mongoConnectionOptions,
		(dbErr) => {
			if (dbErr) console.log(mongoUri, dbErr);
			else console.log("Connected to database ", mongoUri);
			// Case.deleteMany({}).then(res => console.log("Cleared Cases", res));
		}
	);
});