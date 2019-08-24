// THIS PAGE HANDLES ROUTES
const 
	express = require("express"),
	app		= express();

app.get("*",(req,res)=>{
	res.status(404).send("<h1>Page missing!!</h1>");
})

app.listen("8080","localhost",(err)=>{
	if(err) throw err;
	console.log("Server started successfully!!");
})