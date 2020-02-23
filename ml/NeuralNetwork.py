import numpy as np


class Neural_Network(object):
    def __init__(self, inputSize):

        self.inputSize = inputSize
        self.hiddenSize1 = 5
        self.hiddenSize2 = 4
        self.outputSize = 3

        self.W1 = np.random.randn(self.inputSize, self.hiddenSize1)
        self.W2 = np.random.randn(self.hiddenSize1, self.hiddenSize2)
        self.W3 = np.random.randn(self.hiddenSize2, self.outputSize)

    def forward(self, X):
        self.z1 = np.dot(X, self.W1)
        self.z11 = self.sigmoid(self.z1)
        self.z2 = np.dot(self.z11, self.W2)
        self.z22 = self.sigmoid(self.z2)
        self.z3 = np.dot(self.z22, self.W3)
        out = self.sigmoid(self.z3)

        return out

    def sigmoid(self, s):
        return 1 / (1 + np.exp(-s))

    def sigmoidPrime(self, s):
        # derivative of sigmoid
        return s * (1 - s)

    def backward(self, X, Y, out):

        self.out_error = Y - out
        # print(out.shape)
        # print(self.out_error.shape)
        self.out_delta = self.out_error * self.sigmoidPrime(out)
        # print(self.out_delta.shape)

        self.z22_error = self.out_delta.dot(self.W3.T)
        # print(self.z22_error.shape)
        self.z22_delta = self.z22_error * (self.sigmoidPrime(self.z22))
        # print(self.z22_delta.shape)

        self.z11_error = self.z22_delta.dot(self.W2.T)
        # print(self.z11_error.shape)
        self.z11_delta = self.z11_error * (self.sigmoidPrime(self.z11))
        # print(self.z11_delta.shape)

        """
	self.z11_error = self.z22_delta.dot(self.W1.T) 
	print(self.z11_error.shape)
	self.z11_delta = self.z11_error*(self.sigmoidPrime(self.z11))
	print(self.z11_delta.shape) """

        self.W1 = self.W1 + X.T.dot(self.z11_delta)
        self.W2 = self.W2 + self.z11.T.dot(self.z22_delta)
        self.W3 = self.W3 + self.z22.T.dot(self.out_delta)

    def train(self, X, Y):
        out = self.forward(X)
        self.backward(X, Y, out)

    def saveWeights(self):
        np.savetxt("w1.txt", self.W1, fmt="%s")
        np.savetxt("w2.txt", self.W2, fmt="%s")
        np.savetxt("w3.txt", self.W3, fmt="%s")
        np.savetxt("inputSize.txt", self.inputSize, fmt="%d")

    def loadWeights(self):
        self.W1 = np.loadtxt("w1.txt", dtype=float)
        self.W2 = np.loadtxt("w2.txt", dtype=float)
        self.W3 = np.loadtxt("w3.txt", dtype=float)
        return self

    def predict(self, x):
        print("Predicted data based on trained weights: ")
        print("Input (scaled): \n" + str(x))
        # print("Actual Output: \n" + str(y))
        # print("Output: \n" + str(self.forward(x)))
        return self.forward(x)


def LoadNetwork():
    inputSize = None
    try:
        inputSize = np.loadtxt("inputSize.txt", dtype=int)
        return Neural_Network(inputSize).loadWeights()
    except:
        return None

