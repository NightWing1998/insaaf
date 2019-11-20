// THIS PAGE HANGLES NATURAL AND ALL SUCH NLP RELATED ISSUES
// 
// REQUIRES :- database for case handling,jsonfication,etc

const natural = require("natural");
const fs = require("fs");
const pdfParse = require("pdf-parse");

/**
 * 
 * @param {String} casePathAndName 
 */
const preprocessor = async (casePathAndName) => {
	let dotSeperated = casePathAndName.split(".");
	if (dotSeperated[dotSeperated.length - 1] === "pdf") {
		// convert pdf to txt document.

		try {
			console.log(casePathAndName);
			const casePdf = fs.readFileSync(casePathAndName);
			// console.log(casePdf);
			const caseObj = await pdfParse(casePdf);
			fs.unlinkSync(casePathAndName);
			casePathAndName = dotSeperated.slice(0, dotSeperated.length - 1).join(".") + ".txt";

			fs.writeFileSync(casePathAndName, caseObj.text);
			return caseObj.text;
		} catch (exception) {
			console.error(">>>", exception);
		}

	}
};

const gistInJSON = async (casePathAndName) => {
	await preprocessor();
	return {}
};

/**
 * 
 * @param {String} casePathAndName 
 */
const extractor = async (casePathAndName) => {
	return await gistInJSON(casePathAndName);
}

module.exports = extractor;