import numpy as np
from flask import Flask, jsonify, make_response, request
from sklearn.model_selection import train_test_split

import traceback

from NeuralNetwork import LoadNetwork, Neural_Network

global NN
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
        # print(data["inputData"].split("\n")[:-1], data["outputData"].split("\n")[:-1])
        for i in (data["inputData"].split("\n"))[:-1]:
            inputData.append(list(map(int, i.split(","))))
        inputData = np.array(tuple(inputData), dtype=float)
        for i in (data["outputData"].split("\n"))[:-1]:
            outputData.append(list(map(int, i.split(","))))
        outputData = np.array(tuple(outputData), dtype=float)
        xTrain, xTest, yTrain, yTest = train_test_split(
            inputData, outputData, test_size=0.2, random_state=0
        )
        NN = Neural_Network(len(inputData[0]))
        for i in range(2000):
            NN.train(xTrain, yTrain)
        NN.saveWeights()
        loss = np.mean(np.square(yTrain - NN.forward(xTrain)))
        print("Loss: \n" + str(loss))  # mean sum squared loss
        return jsonify({"loss": loss})
    except Exception as e:
        traceback.print_exc()
        print(e)
        data = {"message": str(e)}
        return make_response(jsonify(data), 500)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        NN = LoadNetwork()
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
        x = np.array(tuple(map(int, data["x"])), dtype=float)
        print(x)
        pred = NN.predict(x)
        return jsonify({"prediction": pred.tolist()})
    except Exception as e:
        traceback.print_exc()
        # print(e)
        data = {"message": str(e)}
        return make_response(jsonify(data), 500)


if __name__ == "__main__":
    app.run()
