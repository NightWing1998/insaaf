// THIS PAGE HANGLES NATURAL AND ALL SUCH NLP RELATED ISSUES
// 
// REQUIRES :- database for case handling,jsonfication,etc

const natural = require("natural");
const sw = require("stopword");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const pos = require("pos");

let commonStopwords = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
commonStopwords.push("smt", "SMT", "shri", "SHRI", "Shri","Md", "Smt","viz","Mohd","Yr","Ms");

const extractIPCSections = (tokens) => {
	let ipc = [];
	const searchParams = ["section", [
		["indian", "penal", "code"], "ipc","I.P.C.","IPC","I.P.C"
	]];
	let flag = false;
	let iterator = 0,
		tempIterator = 0,
		searchIterator = 0;
	for (let t of tokens) {
		if (natural.PorterStemmer.stem(t.toLowerCase()) === searchParams[searchIterator] && !flag) {
			flag = true;
			tempIterator = iterator;
			searchIterator++;
			// console.log(flag);
		} else if (flag && parseInt(t).toString() !== "NaN") {
			ipc.push(parseInt(t));
			tempIterator++;
		} else if (flag) {
			if (iterator - tempIterator > 1) {
				flag = false;
			} else {
				break;
			}
		}
		iterator++;
	}
	return ipc;
};

const extractTimeline = (tokens) => {
	let start = "";
	let end = "";
	let searchParams = ["registered", "decided", "duration", "case", "dated", "date", "delivered"];
	let flag = true;
	//console.log(tokens);
	for (let i = 0; i < tokens.length && flag; i++) {
		if (tokens[i].toLowerCase() == searchParams[3]) {
			flag = !flag;
		}
		else if (tokens[i].toLowerCase() == searchParams[0]) {
			start = tokens[i + 1] + "/" + tokens[i + 2] + "/" + tokens[i + 3];
		}
		else if (tokens[i].toLowerCase() == searchParams[1] || tokens[i].toLowerCase() == searchParams[6]) {
			end = tokens[i + 1] + "/" + tokens[i + 2] + "/" + tokens[i + 3];
		}
		else if (tokens[i].toLowerCase() == searchParams[2]) {
			end = tokens[i + 3] + "/" + tokens[i + 2] + "/" + tokens[i + 1];
			flag = !flag;
		}
	}
	if (start == "" || end == "") {
		start = extractCaseNo(tokens);
		let flag = true;
		let ending = "";
		for (let i = 0; i < tokens.length && flag; i++) {
			if (tokens[i].toLowerCase() == searchParams[4] || tokens[i].toLowerCase() == searchParams[5]) {
				ending = tokens[i + 1] + "/" + tokens[i + 2] + "/" + tokens[i + 3];
				flag = !flag;
			}
		}
		start = start.split("/")[1];
		start = "01/01/" + start;
		let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		ending = ending.split("/");
		end = parseInt(ending[0]);
		flag = true;
		for (let i = 0; i < monthNames.length && flag; i++) {
			if (ending[1] == monthNames[i]) {
				i = i + 1;
				end = end + "/" + i + "/";
				flag = !flag;
			}
		}
		end = end + ending[2];

	}
	// console.log(start);
	// console.log(end);
	start = start.split("/");
	let start1 = new Date(start[2], start[1], start[0]);
	end = end.split("/");
	let end1 = new Date(end[2], end[1], end[0]);
	let years = end1.getFullYear() - start1.getFullYear();
	let months = (years * 12) + (end1.getMonth() - start1.getMonth());
	return months;
};

const extractCaseNo = (tokens) => {
	let caseNo;
	let Year;
	let searchParams = ["sessions", "case", "no"];
	let flag = true;
	for (let i = 0; i < tokens.length && flag; i++) {
		if (flag && tokens[i].toLowerCase() === searchParams[0] && tokens[i + 1].toLowerCase() === searchParams[1] && tokens[i + 2].toLowerCase() === searchParams[2]) {
			//console.log(tokens[i]);
			flag = false;
			caseNo = tokens[i + 3];
			Year = tokens[i + 4];
		}
	}
	// console.log(caseNo, Year);
	return caseNo + "/" + Year;
};



const extractVictim = (tokens) => {
	let victim;
	let searchParams = ["deceased","murdered","murder","assaulted","death","victim"];
	let search1Key = ["POINTS","POINT"];
	let search2Key = ["FINDINGS","REASONS","REASON","FINDING"];
	let flag=true, word, tag;
	for(let i=0; i<tokens.length && flag; i++){
		if(search1Key.includes(tokens[i].toUpperCase()) && search2Key.includes(tokens[i+1].toUpperCase())){
			while(tokens[i]!== "REASONS" && flag){
				i++;
				if(searchParams.includes(tokens[i].toLowerCase())){
					const words = new pos.Lexer().lex(tokens[i+1]);
					const tagger = new pos.Tagger();
					const taggedWords = tagger.tag(words);
					word=taggedWords[0][0];
					tag=taggedWords[0][1];
					if((tag==="NN" || tag==="NNP") && !searchParams.includes(word.toLowerCase())) {
						flag = !flag;
						victim = word;
					}
				}
			}
		}
	}
	return victim;
};


const extractAccused = (text) => {
	let accused = [];
	const vsRegEx = /(v|V)(((\.|\/)?(s|S)\.?)|(ers(u|e)s.?))/;
	const aRegEx = /(a|A)ccused/;
	let i = text.search(vsRegEx);
	let j = text.search(aRegEx);
	// console.log(text);
	let tokens = text.slice(i, j).replace(" ", "").split("\n").slice(1);
	let aInt = 0;
	if (tokens[0][0] == (aInt + 1)) {
		for (i = 0; i < tokens.length; i++) {
			// console.log("!", tokens[i][0] == (aInt + 1));
			if (tokens[i][0] == (aInt + 1)) {
				aInt++;
				// console.log(tokens[i]);
				let temp = tokens[i].replace(/(\d| |\.|]|\))*/, "");
				// console.log("##", temp);
				accused.push(temp);
			}
		}
	} else {
		accused.push(tokens[0]);
	}
	return accused;
};

/**
 * 
 * @param {String} casePathAndName 
 */
const preprocessor = async (casePathAndName) => {
	let dotSeperated = casePathAndName.split(".");
	if (dotSeperated[dotSeperated.length - 1] === "pdf") {
		// convert pdf to txt document.
		// console.log(casePathAndName);
		const casePdf = fs.readFileSync(casePathAndName);
		// console.log(casePdf);
		// backup variable
		let _window;
		if(window){ _window = window; window = undefined;}

		const caseObj = await pdfParse(casePdf);

		if(_window) window = _window;
		fs.unlinkSync(casePathAndName);
		casePathAndName = dotSeperated.slice(0, dotSeperated.length - 1).join(".") + ".txt";

		fs.writeFileSync(casePathAndName, caseObj.text);
		return caseObj.text;
	} else if (dotSeperated[dotSeperated.length - 1] === "txt") {
		return fs.readFileSync(casePathAndName).toString();
	} else {
		throw new Error("Invalid file extnsion " + dotSeperated[dotSeperated.length - 1] + "The file extension should be pdf or txt.");
	}
	
};

const gistInJSON = async (casePathAndName) => {
	let textResponse = await preprocessor(casePathAndName);
	const tokenizer = new natural.WordTokenizer();
	let tokens = tokenizer.tokenize(textResponse);
	// console.log(tokens.slice(0, 200));

	tokens = sw.removeStopwords(sw.removeStopwords(tokens), commonStopwords);
	// console.log(tokens);
	return {
		penalCodes: extractIPCSections(tokens.slice(0, 500)),
		caseNumber: extractCaseNo(tokens.slice(0, 200)),
		prosecution: ["The State"],
		victim: extractVictim(tokens),
		accused: extractAccused(textResponse),
		caseStart: ""
	};
};

/**
 * 
 * @param {String} casePathAndName 
 */
const extractor = async (casePathAndName) => {
	return await gistInJSON(casePathAndName);
};

module.exports = extractor;
