from flask import Flask, jsonify, make_response, request

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn import preprocessing, metrics
from joblib import dump, load

import traceback

app = Flask(__name__)

global model, outputEncoder

model = None
outputEncoder = None
try:
	# model = load("./model/random_forest.sav")
	model = load("./model/neural_network.sav")
	outputEncoder = load("./model/output_encoder.sav")
except FileNotFoundError:
	print("No saved model exists. Train the model first")


@app.route("/hello")
def hello():
	print(model, outputEncoder)
	return make_response(jsonify({"hello": "hi"}), 200)

@app.route("/train", methods=["POST"])
def train():
	try:
		data = request.get_json()
		global model, outputEncoder
		model = RandomForestClassifier(n_estimators=100,
										   bootstrap=True,
										   max_features='sqrt',
										   n_jobs=-1)
		# model = MLPClassifier(solver='lbfgs', alpha=1e-5, hidden_layer_sizes=(5, 4), random_state=1, )

		outputEncoder = preprocessing.LabelEncoder()

		eviSet = []
		inp = []
		output = []

		for i in data:
			temp = [
				i["means"], i["motive"], i["opportunity"],i["time_since_petition_filed"]
			]
			for _,value in i["evidence"]["for"].items():
				temp.append(value)
			for _,value in i["evidence"]["against"].items():
				temp.append(value)
			inp.append(temp)
			output.append(i["conclusion"])

		outputEncoder.fit(output)

		xTrain, xTest, yTrain, yTest = train_test_split(inp,
														outputEncoder.transform(output),
														test_size=0.3,
														random_state=0)

		model.fit(xTrain, yTrain)

		result = model.predict(xTest)

		score = model.score(xTest, yTest)
		meanError = metrics.mean_absolute_error(yTest, result)
		squareError = metrics.mean_squared_error(yTest, result)
		rmsError = np.sqrt(metrics.mean_squared_error(yTest, result))

		# dump(model, "./model/random_forest.sav")
		dump(model, "./model/neural_network.sav")
		dump(outputEncoder, "./model/output_encoder.sav")

		return make_response(
			jsonify({
				"score": score,
				"mean-error": meanError,
				"square-error": squareError,
				"rms-error": rmsError
			}), 201)
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
		if model == None or outputEncoder == None:
			raise Exception(
				"Model is not trained. Please first train the same on /train route"
			)
		xTest = [
			data["means"], data["motive"], data["opportunity"],data["time_since_petition_filed"]
		]

		for _,value in data["evidence"]["for"].items():
			xTest.append(value)
		for _,value in data["evidence"]["against"].items():
			xTest.append(value)

		print("**", xTest)

		return make_response(
			jsonify({
				"result": outputEncoder.inverse_transform(model.predict([xTest]))[0],
				# "path" : " ".join(str(e) for e in model.decision_path([xTest])[1])
			}),
			200)
	except Exception as e:
		traceback.print_exc()
		# print(e)
		data = {"message": str(e), "error": True}
		return make_response(jsonify(data), 500)


if __name__ == "__main__":
	app.run(debug= True)
