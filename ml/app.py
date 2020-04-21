from flask import Flask, jsonify, make_response, request

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn import preprocessing, metrics
from joblib import dump, load

import traceback

app = Flask(__name__)

global model, outputEncoder, evidenceEncoder

model = None
outputEncoder = None
evidenceEncoder = None
try:
	model = load("random_forest.sav")
	outputEncoder = load("output_encoder.sav")
	evidenceEncoder = load("evidence_encoder.sav")
except FileNotFoundError:
	print("No saved model exists. Train the model first")


@app.route("/hello")
def hello():
	print(model, outputEncoder, evidenceEncoder)
	return make_response(jsonify({"hello": "hi"}),200)


@app.route("/train", methods=["POST"])
def train():
	try:
		data = request.get_json()
		global model, outputEncoder, evidenceEncoder
		if model == None:
			model = RandomForestClassifier(n_estimators=100,
								bootstrap = True,
								max_features = 'sqrt',
								n_jobs=-1)
		
		outputEncoder = preprocessing.LabelEncoder()
		evidenceEncoder = preprocessing.LabelEncoder()
		
		eviSet = []
		inp = []
		output = []

		for i in data:
			for key, value in i["evidence"]["for"].items():
				if type(value) is list:
					for j in value:
						if j not in eviSet:
							eviSet.append(str(j))
				else:
					eviSet.append(str(value))
			for key, value in i["evidence"]["against"].items():
				if type(value) is list:
					for j in value:
						if j not in eviSet:
							eviSet.append(str(j))
				else:
					eviSet.append(str(value))
		evidenceEncoder.fit(eviSet)

		for i in data:
			temp = [i["means"],i["motive"],i["opportunity"],i["witness"]["for"],i["witness"]["against"],i["time_since_petition_filed"]]
			eviFor = []
			eviAgainst = []
			for key, value in i["evidence"]["for"].items():
				if type(value) is list:
					eviFor.append("".join(str(e) for e in evidenceEncoder.transform(value)))    
				else:
					eviFor.append(str(evidenceEncoder.transform([str(value)])[0]))
			for key, value in i["evidence"]["against"].items():
				if type(value) is list:
					eviAgainst.append("".join(str(e) for e in evidenceEncoder.transform(value)))    
				else:
					eviAgainst.append(str(evidenceEncoder.transform([str(value)])[0]))
			if len(eviFor) == 0:
				eviFor = "-1"
			else:
				eviFor = "".join(eviFor)
			if len(eviAgainst) == 0:
				eviAgainst = "-1"
			else:
				eviAgainst = "".join(eviAgainst)
			temp.append(eviFor)
			temp.append(eviAgainst)
			inp.append(temp)
			output.append(i["conclusion"])
		outputEncoder.fit(output)

		xTrain, xTest, yTrain, yTest = train_test_split(inp, outputEncoder.transform(output), test_size = 0.3, random_state = 0)

		model.fit(xTrain, yTrain)

		result = model.predict(xTest)

		score = model.score(xTest, yTest)
		meanError = metrics.mean_absolute_error(yTest, result)
		squareError = metrics.mean_squared_error(yTest, result)
		rmsError = np.sqrt(metrics.mean_squared_error(yTest, result))

		dump(model, "random_forest.sav")
		dump(outputEncoder, "output_encoder.sav")
		dump(evidenceEncoder, "evidence_encoder.sav")

		return make_response(jsonify({
			"score": score,
			"mean-error": meanError,
			"square-error": squareError,
			"rms-error": rmsError
		}),201)
	except Exception as e:
		traceback.print_exc()
		print(e)
		data = {"message": str(e), "error": True}
		return make_response(jsonify(data), 500)


@app.route("/predict", methods=["POST"])
def predict():
	try:
		data = request.get_json()
		print(data)
		if model == None or outputEncoder == None or evidenceEncoder == None:
			raise Exception("Model is not trained. Please first train the same on /train route")
		xTest = [data["means"],data["motive"],data["opportunity"],data["witness"]["for"],data["witness"]["against"],data["time_since_petition_filed"]]
		eviFor = []
		eviAgainst = []
		for _, value in data["evidence"]["for"].items():
			if type(value) is list:
				eviFor.append("".join(str(e) for e in evidenceEncoder.transform(value)))    
			else:
				eviFor.append(str(evidenceEncoder.transform([str(value)])[0]))
		for _, value in data["evidence"]["against"].items():
			if type(value) is list:
				eviAgainst.append("".join(str(e) for e in evidenceEncoder.transform(value)))    
			else:
				eviAgainst.append(str(evidenceEncoder.transform([str(value)])[0]))
		if len(eviFor) == 0:
			eviFor = "-1"
		else:
			eviFor = "".join(eviFor)
		if len(eviAgainst) == 0:
			eviAgainst = "-1"
		else:
			eviAgainst = "".join(eviAgainst)
		xTest.append(eviFor)
		xTest.append(eviAgainst)

		print("**",xTest)

		return make_response(jsonify({
			"result": outputEncoder.inverse_transform( model.predict([xTest]) )[0],
			# "path" : " ".join(str(e) for e in model.decision_path([xTest])[1])
		}),200)
	except Exception as e:
		traceback.print_exc()
		# print(e)
		data = {"message": str(e), "error": True}
		return make_response(jsonify(data), 500)


if __name__ == "__main__":
	app.run()
