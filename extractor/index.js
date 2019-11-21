// THIS PAGE HANGLES NATURAL AND ALL SUCH NLP RELATED ISSUES
// 
// REQUIRES :- database for case handling,jsonfication,etc

const natural = require("natural");
const sw = require("stopword");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const pos = require('pos');

const alhpa = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const extractIPCSections = (tokens) => {
	let ipc = [];
	const searchParams = ["section", [
		["indian", "penal", "code"], "ipc"
	]];
	let flag = false;
	for (let i = 0; i < tokens.length; i++) {}
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
}

const extractCaseNo = (tokens) => {
	let caseNo;
	let Year;
	let searchParams = ['case', 'no'];
	let flag = true;
	for (let i = 0; i < tokens.length && flag; i++) {
		if (flag && tokens[i].toLowerCase() === searchParams[0] && tokens[i + 1].toLowerCase() === searchParams[1]) {
			//console.log(tokens[i]);
			flag = false;
			caseNo = tokens[i + 2];
			Year = tokens[i + 3];
		}
	}
	// console.log(caseNo, Year);
	return caseNo + "/" + Year;
}


const extractVictim = (tokens) =>{
	let victim;
	let nouns=['body','stone','head'];
	let searchParams=['deceased','killed','murdered','death'];
	flag=true;
	for(let i = 0; i < tokens.length && flag; i++){
		if(searchParams.includes(tokens[i].toLowerCase())){
			sentence = '';
			for(let j=i-1 ; j< i+2 && flag ; j++){
				sentence = sentence + ' ' +tokens[j];
			}
			const words = new pos.Lexer().lex(sentence);
			const tagger = new pos.Tagger();
			const taggedWords = tagger.tag(words);
			if(flag){
				for (k in taggedWords) {
					var taggedWord = taggedWords[k];
					var word = taggedWord[0];
					var tag = taggedWord[1];
					console.log(word + " /" + tag);
					if(tag=='NN' && flag && !searchParams.includes(word) && !nouns.includes(word)){
						flag=!flag;
						victim=word;
					}
				}
			}
		}
	}
	return victim;
}


/**const extractVictim = (tokens) =>{
	let victim;
	let searchParams=['deceased','killed','murdered'];
	for(let i = 0; i < tokens.length; i++){
		if(searchParams.includes(tokens[i].toLowerCase())){
			console.log(tokens[i+1]);
			victim=tokens[i+1];
			break;
		}
	}
	return victim;
}*/


const extractAccused= (tokens) =>{
	let accused;
	let searchParams=['v','s'];
	let flag1=true;
	let flag2=false;
	let string;
	for(let i = 0; i < tokens.length && tokens[i].toLowerCase()!='judgement' && flag1; i++){
		if(!flag2 && tokens[i].toLowerCase()===searchParams[0] && tokens[i+1].toLowerCase()===searchParams[1]){
			flag2=true;
		}
		if(flag2){
			i++;
			i++;

		}
	}
	return accused;
}

/**
 * 
 * @param {String} casePathAndName 
 */
const preprocessor = async (casePathAndName) => {
	try {
		let dotSeperated = casePathAndName.split(".");
		if (dotSeperated[dotSeperated.length - 1] === "pdf") {
			// convert pdf to txt document.
			console.log(casePathAndName);
			const casePdf = fs.readFileSync(casePathAndName);
			// console.log(casePdf);
			const caseObj = await pdfParse(casePdf);
			fs.unlinkSync(casePathAndName);
			casePathAndName = dotSeperated.slice(0, dotSeperated.length - 1).join(".") + ".txt";

			fs.writeFileSync(casePathAndName, caseObj.text);
			return caseObj.text;
		} else if (dotSeperated[dotSeperated.length - 1] === "txt") {
			return fs.readFileSync(casePathAndName).toString();
		} else {
			throw new Error("Invalid file extnsion " + dotSeperated[dotSeperated.length - 1] + "The file extension should be pdf or txt.")
		}
	} catch (exception) {
		console.error(">>>", exception);
		throw exception;
	}

};

const gistInJSON = async (casePathAndName) => {
	try {
		let textResponse = await preprocessor(casePathAndName);
		const tokenizer = new natural.WordTokenizer();
		let tokens = tokenizer.tokenize(textResponse);
		//console.log(tokens);

		tokens = sw.removeStopwords(sw.removeStopwords(tokens, alhpa.split("")));
		console.log(tokens);
		return {
			penalCodes: extractIPCSections(tokens.slice(0, 500)),
			caseNumber: extractCaseNo(tokens.slice(0, 200)),
			prosecution: "the state",
			victim: extractVictim(tokens)
			// accused: extractAccused(tokens.slice(0, 100)),
		};
	} catch (exception) {
		// console.log(exception);
		throw exception;
	}

};

/**
 * 
 * @param {String} casePathAndName 
 */
const extractor = async (casePathAndName) => {
	try {
		return await gistInJSON(casePathAndName);
	} catch (exception) {
		throw exception;
	}

}

module.exports = extractor;