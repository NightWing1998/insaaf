// THIS PAGE HANDLES ROUTES
const 
	express 	= require("express"),
	app			= express(),
	mongoose	= require("mongoose"),
	bodyParser	= require("body-parser"),
	constant	= require("./constants");

const uri = constant("DATABASE");

const Case = require("./models/case");

app.use(bodyParser.json({}));

app.get("/createCase",(req,res)=>{
	let { apellant,respondent,caseNumber,penalCode,suspect,evidence,witness } = req.query;
	// console.log(req.query);
	penalCode = penalCode.split(",").map(Number);
	suspect = suspect.split(",");
	evidence = typeof evidence !== 'undefined' ? evidence.split(",") : [""];
	witness = typeof witness !== 'undefined' ? witness.split(",") : [""];
	// console.log("!",apellant,"@",respondent,"#",caseNumber,"$",penalCode,"%",suspect,"^",evidence,"&",witness);
	Case.createCase({apellant,respondent,caseNumber,penalCode,suspect,witness,evidence},(err,response)=>{
		if(err) throw err;
		res.status(200).json(response);
	});
});

app.get("*",(req,res)=>{
	console.log(req.connection.remoteAddress);
	res.status(404).send("<h1>Page missing!!</h1>");
});

app.listen(constant("PORT"),constant("IP"),async (err)=>{
	if(err) throw err;
	console.log("Server started successfully!!");
	console.log(constant("PORT"),uri,constant("IP"));
	mongoose.connect(uri,{ useNewUrlParser: true ,useUnifiedTopology:true},(err)=>{
		if(err) throw err;
		console.log("Connected to database");
	});
});

// process.on('SIGINT',(code)=>{
// 	if(client){
// 		client.close();
// 	}
// });