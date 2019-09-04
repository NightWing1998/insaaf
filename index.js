// THIS PAGE HANDLES ROUTES
const 
	express 	= require("express"),
	app			= express(),
	mongoose	= require("mongoose"),
	constant	= require("./constants"),
	multer		= require("multer"),
	upload		= multer();

const uri = constant("DATABASE");

const Case = require("./models/case");

app.use(express.urlencoded({extended:false}));
app.use(express.json({}));
app.use(upload.array());

app.get("/createCase",(req,res)=>{
	let { apellant,respondent,caseNumber,penalCode,suspect,evidence,witness } = req.body;
	console.log(req.query,req.body);
	penalCode = penalCode.split(",").map(Number);
	suspect = suspect.split(",");
	evidence = typeof evidence !== 'undefined' ? evidence.split(",") : [""];
	witness = typeof witness !== 'undefined' ? witness.split(",") : [""];
	// console.log("!",apellant,"@",respondent,"#",caseNumber,"$",penalCode,"%",suspect,"^",evidence,"&",witness);
	Case.createCase({apellant,respondent,caseNumber,penalCode,suspect,witness,evidence},(err,response)=>{
		if(err) res.status(500).json(err)
		else res.status(200).json(response);
	});
});

app.get("*",(req,res)=>{
	console.log(req.connection.remoteAddress);
	res.status(404).send("<h1>Page missing!!</h1>");
});

app.listen(constant("PORT"),constant("IP"),async (err)=>{
	if(err) throw err;
	console.log("Server started successfully!!");
	// console.log(constant("PORT"),uri,constant("DATABASE_PASSWORD"));
	mongoose.connect(uri,{ 
		useNewUrlParser: true ,
		useUnifiedTopology:true, 
		useCreateIndex:true,
		user:constant("DATABASE_USERNAME"),
		pass:constant("DATABASE_PASSWORD")
	},
		(err)=>{
			if(err) throw err;
			console.log("Connected to database");
		}
	);
});