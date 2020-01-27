import Observable from '../classes/observable.js';

class View extends Observable {
	constructor(config, model) {
		super();

		this.config = config;
		this.model = model;

		this.highscore = 0;

		this.ctx = document.getElementById('canvas').getContext('2d');

		let btnIncreaseMut = document.getElementById('btnIncreaseMut');
		let btnDecreaseMut = document.getElementById('btnDecreaseMut');

		btnIncreaseMut.style.display = 'block';
		btnDecreaseMut.style.display = 'block';

		btnIncreaseMut.addEventListener('click', (event) => {
			this.emit('increaseMutationAction');
		});

		btnDecreaseMut.addEventListener('click', (event) => {
			this.emit('decreaseMutationAction');
		});

		this.init();
	}

	init() {
		window.setInterval(() => {
			this.render();
		}, this.config.fps);
	}

	update() {
		if (this.model.done()) {
			this.highscore = this.model.bestSnake.score;

			this.model.calculateFitness();
			this.model.naturalSelection();
		} else {
			this.model.update();
		}
	}

	render() {
		this.update();

		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.config.width, this.config.height);

		this.ctx.strokeStyle = 'white';
		this.ctx.moveTo(400, 0);
		this.ctx.lineTo(400, this.config.height);

		this.ctx.rect(400 + this.config.size, this.config.size, this.config.width-400-40, this.config.height-40);
		this.ctx.stroke();

		if (!this.model.done()) {
			this.renderPopulation(this.model);
		}

		this.ctx.font = '12pt sans-serif';
		this.ctx.textAlign = 'left';

		this.ctx.fillStyle = 'grey';
		this.ctx.fillText('GEN : ' + this.model.gen, 20, 60);
		this.ctx.fillText('MUTATION RATE : ' + (this.config.mutationRate * 100) + '%', 20, 85);
		this.ctx.fillText('BEST FITNESS : ' + this.model.bestFitness, 20, 110);
		this.ctx.fillText('LIVING SNAKES : ' + this.model.maxLivingSnakes, 20, 135);
		this.ctx.fillText('MOVES LEFT : ' + this.model.maxlifeLeft, 20, 160);
		this.ctx.fillText('SCORE : ' + this.model.bestSnake.score, 20, 250);
		this.ctx.fillText('HIGHSCORE : ' + this.highscore, 20, 275);
	}

	renderFood(food) {
		this.ctx.fillStyle = 'red';
		this.ctx.fillRect(
			400 + this.config.size + food.pos.x * this.config.size,
			this.config.size + food.pos.y * this.config.size,
			this.config.size,
			this.config.size
		);
	}

	renderSnake(snake) {
		this.renderFood(snake.food);

		this.ctx.fillStyle = 'white';

		for(let i = 0; i < snake.body.length; ++i) {
			this.ctx.fillRect(
				400 + this.config.size + snake.body[i].x * this.config.size,
				this.config.size + snake.body[i].y * this.config.size,
				this.config.size,
				this.config.size
			);
		}

		if (snake.dead) {
			this.ctx.fillStyle = 'grey';
		} else {
			this.ctx.fillStyle = 'white';
		}

		this.ctx.fillRect(
			400 + this.config.size + snake.head.x * this.config.size,
			this.config.size + snake.head.y * this.config.size,
			this.config.size,
			this.config.size
		);
	}

	renderPopulation(population) {
		// show either the best snake or all the snakes
		if (this.config.replayBest) {
			this.renderSnake(population.bestSnake);
		} else {
			for (let i = 0; i < population.snakes.length; ++i) {
				if (!population.snakes[i].dead) {
					this.renderSnake(population.snakes[i]);
				}
			}
		}
	}
}

export default View;