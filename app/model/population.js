import Snake from "./snake.js";

class Population {
	constructor(config, size) {
		this.config = config;
		this.snakes = [];

		this.bestSnakeScore = 0;
		this.gen = 0;
		this.samebest = 0;

		this.fitnessSum = 0;
		this.bestFitness = 0;

		this.maxlifeLeft = 0;
		this.maxLivingSnakes = 0;

		for (let i = 0; i < size; ++i) {
			this.snakes[i] = new Snake(this.config, {
				layers: this.config.hiddenLayers
			});
		}

		this.bestSnake = this.snakes[0].clone();
		this.bestSnake.replay = true;
	}

	done() {
		// check if all the snakes in the population are dead
		for(let i = 0; i < this.snakes.length; ++i) {
			if (!this.snakes[i].dead) {
				return false;
			}
		}

		if (!this.bestSnake.dead) {
			return false;
		}

		return true;
	}

	update() {
		let livingSnakes = 0;
		let maxlifeLeft = 0;

		// update all the snakes in the generation
		if (!this.bestSnake.dead) {
			// if the best snake is not dead update it, this snake is a replay of the best from the past generation
			this.bestSnake.look();
			this.bestSnake.think();
			this.bestSnake.move();
		}

		for (let i = 0; i < this.snakes.length; ++i) {
			if (!this.snakes[i].dead) {
				this.snakes[i].look();
				this.snakes[i].think();
				this.snakes[i].move();

				if (this.snakes[i].lifeLeft > maxlifeLeft) {
					maxlifeLeft = this.snakes[i].lifeLeft;
				}

				livingSnakes++;
			}
		}

		this.maxlifeLeft = maxlifeLeft;
		this.maxLivingSnakes = livingSnakes;
	}

	setBestSnake() {
		//set the best snake of the generation
		let max = 0;
		let maxIndex = 0;

		for (let i = 0; i < this.snakes.length; ++i) {
			if (this.snakes[i].fitness > max) {
				max = this.snakes[i].fitness;
				maxIndex = i;
			}
		}

		if (max > this.bestFitness) {
			this.bestFitness = max;
			this.bestSnake = this.snakes[maxIndex].cloneForReplay();
			this.bestSnakeScore = this.snakes[maxIndex].score;
		} else {
			this.bestSnake = this.bestSnake.cloneForReplay();
		}
	}

	selectParent() {
		// selects a random number in range of the fitnesssum and if a snake falls in that range then select it
		let rand = Math.random() * this.fitnessSum;
		let summation = 0;

		for (let i = 0; i < this.snakes.length; ++i) {
			summation += this.snakes[i].fitness;

			if( summation > rand) {
				return this.snakes[i];
			}
		}

		return this.snakes[0];
	}

	naturalSelection() {
		let i;
		let newSnakes = [];

		this.setBestSnake();
		this.calculateFitnessSum();

		  // add the best snake of the prior generation into the new generation
		newSnakes[0] = this.bestSnake.clone();

		for (i = 1; i < this.snakes.length; ++i) {
			let child = this.selectParent().crossover(this.selectParent());

			child.mutate();
			newSnakes[i] = child.clone();
		}

		//this.snakes = newSnakes;
		for (i = 0; i < this.snakes.length; ++i) {
			this.snakes[i] = newSnakes[i].clone();
		}

		this.config.evolution.push(this.bestSnakeScore);
		this.gen += 1;

		console.log(this.config.evolution);
	}

	mutate() {
		// start from 1 as to not override the best snake placed in index 0
		for (let i = 1; i < this.snakes.length; ++i) {
		   this.snakes[i].mutate();
		}
	}

	calculateFitness() {
		// calculate the fitnesses for each snake
		for (let i = 0; i < this.snakes.length; ++i) {
			this.snakes[i].calculateFitness();
		}
	}

	calculateFitnessSum() {
		// calculate the sum of all the snakes fitnesses
		this.fitnessSum = 0;

		for (let i = 0; i < this.snakes.length; ++i) {
			this.fitnessSum += this.snakes[i].fitness;
		}
	}
}

export default Population;