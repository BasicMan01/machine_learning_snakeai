class Config {
	constructor() {
		this.fps = 30;
		this.height = 800;
		this.hiddenLayers = 2;
		this.hiddenNodes = 16;
		this.mutationRate = 0.05;
		this.size = 20;
		this.tiles = 38;
		this.width = 1200;

		this.replayBest = true;

		this.defaultMutation = this.mutationRate;
		this.evolution = [];
	}

	increaseMutation() {
		this.mutationRate *= 2;
		this.defaultMutation = this.mutationRate;
	}

	decreaseMutation() {
		this.mutationRate /= 2;
		this.defaultMutation = this.mutationRate;
	}
}

export default Config;
