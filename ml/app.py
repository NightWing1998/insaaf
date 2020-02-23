import numpy as np
from flask import Flask, jsonify, make_response, request
from sklearn.model_selection import train_test_split

from NeuralNetwork import LoadNetwork, Neural_Network

app = Flask(__name__)

NN = LoadNetwork()


@app.route("/hello")
def hello():
    return jsonify({"hello": "hi"})


@app.route("/train", methods=["POST"])
def train():
    try:
        data = request.get_json()
        inputData = []
        outputData = []
        for i in data["inputData"].split("\n"):
            inputData.append(list(map(int, i.split(","))))
        inputData = tuple(inputData)
        for i in data["outputData"].split("\n"):
            outputData.append(list(map(int, data["outputData"].split(","))))
        outputData = tuple(outputData)
        xTrain, xTest, yTrain, yTest = train_test_split(
            inputData, outputData, test_size=0.2, random_state=0
        )
        NN = Neural_Network(len(inputData[0]))
        NN.train(xTrain, yTrain)
        NN.saveWeights()
        loss = np.mean(np.square(yTrain - NN.forward(xTrain)))
        print("Loss: \n" + str(loss))  # mean sum squared loss
        return jsonify({"loss": loss})
    except Exception as e:
        print(e)
        data = {"message": str(e)}
        return make_response(jsonify(data), 500)


@app.route("/predict", methods=["POST"])
def predict():
    if NN == None:
        return make_response(
            jsonify(
                {
                    "error": "Neural network is not trained. Please train the network first"
                }
            ),
            500,
        )
    data = request.get_json()
    x = data["x"]
    return NN.predict(x)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
