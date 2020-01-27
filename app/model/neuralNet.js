import Matrix2 from '../classes/matrix2.js';

class NeuralNet {
	constructor(input, hidden, output, hiddenLayers) {
		this.inputNodes = input;
		this.hiddenNodes = hidden;
		this.outputNodes = output;
		this.hiddenLayers = hiddenLayers;

		this.weights = [];
		this.weights[0] = new Matrix2(this.hiddenNodes, this.inputNodes + 1);

		for (let i = 1; i < this.hiddenLayers; ++i) {
			this.weights[i] = new Matrix2(this.hiddenNodes, this.hiddenNodes + 1);
		}

		this.weights[this.weights.length] = new Matrix2(this.outputNodes, this.hiddenNodes + 1);

		for (let i = 0; i < this.weights.length; ++i) {
			this.weights[i].randomize();
		}
	}

	mutate(mutationRate) {
		for (let i = 0; i < this.weights.length; ++i) {
			this.weights[i].mutate(mutationRate);
		}
	}

	output(inputsArr) {
		let inputs = this.weights[0].singleColumnMatrixFromArray(inputsArr);
		let currBias = inputs.addBias();

		for (let i = 0; i < this.hiddenLayers; ++i) {
			let hiddenIn = this.weights[i].dot(currBias);
			let hiddenOut = hiddenIn.activate();

			currBias = hiddenOut.addBias();
		}

		let outputIn = this.weights[this.weights.length - 1].dot(currBias);
		let outputOut = outputIn.activate();

		return outputOut.toArray();
	}

	crossover(partner) {
		let child = new NeuralNet(this.inputNodes, this.hiddenNodes, this.outputNodes, this.hiddenLayers);

		for(let i = 0; i < this.weights.length; ++i) {
		   child.weights[i] = this.weights[i].crossover(partner.weights[i]);
		}

		return child;
	}

	clone() {
		let clone = new NeuralNet(this.inputNodes, this.hiddenNodes, this.outputNodes, this.hiddenLayers);

		for(let i = 0; i < this.weights.length; ++i) {
		   clone.weights[i] = this.weights[i].clone();
		}

		return clone;
	}
}

export default NeuralNet;