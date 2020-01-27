import Food from './food.js';
import NeuralNet from './neuralNet.js';
import Vector2 from '../classes/vector2.js';

class Snake {
	constructor(config, args = {}) {
		this.config = config || {};
		this.tiles = config.tiles || 40;

		this.xVel = 0;
		this.yVel = 0;
		this.score = 0;
		this.foodItterate = 0;	// itterator to run through the foodlist (used for replay)
		this.fitness = 0;
		this.lifeLeft = 200;	// amount of moves the snake can make before it dies
		this.lifetime = 0;		// amount of time the snake has been alive

		this.dead = false;
		this.replay = false;	// if this snake is a replay of best snake

		this.foodList = [];		//list of food positions (used to replay the best snake)
		this.vision = [];
		this.decision = [];

		this.head = new Vector2(0, this.tiles - 3);

		this.body = [];
		this.body.push(new Vector2(0, this.tiles - 2));
		this.body.push(new Vector2(0, this.tiles - 1));

		if (args.layers) {
			this.food = new Food(this.tiles);

			this.foodList.push(this.food.clone());
			this.brain = new NeuralNet(24, this.config.hiddenNodes, 4, args.layers);
		} else if (args.foodList) {
			this.replay = true;	// if this snake is a replay of best snake

			//this constructor passes in a list of food positions so that a replay can replay the best snake
			for (let i = 0; i < args.foodList.length; ++i) {
				this.foodList.push(args.foodList[i].clone());
			}

			this.food = this.foodList[this.foodItterate];
			this.foodItterate++;
		}
	}

	bodyCollide(x, y) {
		// check if a position collides with the snakes body
		for (let i = 0; i < this.body.length; ++i) {
		   if (x == this.body[i].x && y == this.body[i].y)  {
			  return true;
		   }
		}

		return false;
	}

	foodCollide(x, y) {
		// check if a position collides with the food
		if (x == this.food.pos.x && y == this.food.pos.y) {
			return true;
		}

		return false;
	}

	wallCollide(x, y) {
		// check if a position collides with the wall
		if (x >= this.tiles || x < 0 ||	y >= this.tiles || y < 0) {
			return true;
		}

		return false;
	}

	move() {
		if (!this.dead) {
			this.lifetime++;
			this.lifeLeft--;

			if (this.foodCollide(this.head.x, this.head.y)) {
				this.eat();
			}

			this.shiftBody();

			if (this.wallCollide(this.head.x, this.head.y)) {
				this.dead = true;
			} else if (this.bodyCollide(this.head.x, this.head.y)) {
				this.dead = true;
			} else if (this.lifeLeft <= 0) {
				this.dead = true;
			}
		}
	}

	eat() {
		let len = this.body.length - 1;
		this.score++;

		if (this.lifeLeft < 500) {
			if (this.lifeLeft > 400) {
				this.lifeLeft = 500;
			} else {
				this.lifeLeft += 100;
			}
		}

		if (len >= 0) {
			this.body.push(new Vector2(this.body[len].x, this.body[len].y));
		} else {
			this.body.push(new Vector2(this.head.x, this.head.y));
		}

		if (!this.replay) {
			this.food = new Food(this.tiles);

			while (this.bodyCollide(this.food.pos.x, this.food.pos.y)) {
				this.food = new Food(this.tiles);
			}

			this.foodList.push(this.food);
		} else {
			// if the snake is a replay, then we dont want to create new random foods, we want to see the positions the best snake had to collect
			this.food = this.foodList[this.foodItterate];
			this.foodItterate++;
		}
	}

	shiftBody() {
		let tempx = this.head.x;
		let tempy = this.head.y;
		let temp2x = 0;
		let temp2y = 0;

		if (this.xVel != 0 || this.yVel != 0) {
			this.head.x += this.xVel;
			this.head.y += this.yVel;

			for(let i = 0; i < this.body.length; ++i) {
				temp2x = this.body[i].x;
				temp2y = this.body[i].y;
				this.body[i].x = tempx;
				this.body[i].y = tempy;
				tempx = temp2x;
				tempy = temp2y;
			}
		}
	}

	cloneForReplay() {
		// clone a version of the snake that will be used for a replay
		let clone = new Snake(this.config, {
			foodList: this.foodList
		});

		clone.brain = this.brain.clone();

		return clone;
	}

	clone() {
		// clone the snake
		let clone = new Snake(this.config, {
			layers: this.config.hiddenLayers
		});

		clone.brain = this.brain.clone();

		return clone;
	}

	crossover(parent) {
		// crossover the snake with another snake
		let child = new Snake(this.config, {
			layers: this.config.hiddenLayers
		});

		child.brain = this.brain.crossover(parent.brain);

		return child;
	}

	mutate() {
		// mutate the snakes brain
		this.brain.mutate(this.config.mutationRate);
	}

	calculateFitness() {
		// calculate the fitness of the snake
		if (this.score < 10) {
			this.fitness = Math.floor(this.lifetime * this.lifetime) * Math.pow(this.score, 2);
		} else {
			this.fitness = Math.floor(this.lifetime * this.lifetime) * Math.pow(10, 2);
			this.fitness *= (this.score - 9);
		}
	}

	look() {
		// look in all 8 directions and check for food, body and wall
		let temp;

		temp = this.lookInDirection(new Vector2(-1, 0));
		this.vision = [];
		this.vision[0] = temp[0];
		this.vision[1] = temp[1];
		this.vision[2] = temp[2];

		temp = this.lookInDirection(new Vector2(-1, -1));
		this.vision[3] = temp[0];
		this.vision[4] = temp[1];
		this.vision[5] = temp[2];

		temp = this.lookInDirection(new Vector2(0, -1));
		this.vision[6] = temp[0];
		this.vision[7] = temp[1];
		this.vision[8] = temp[2];

		temp = this.lookInDirection(new Vector2(1, -1));
		this.vision[9] = temp[0];
		this.vision[10] = temp[1];
		this.vision[11] = temp[2];

		temp = this.lookInDirection(new Vector2(1, 0));
		this.vision[12] = temp[0];
		this.vision[13] = temp[1];
		this.vision[14] = temp[2];

		temp = this.lookInDirection(new Vector2(1, 1));
		this.vision[15] = temp[0];
		this.vision[16] = temp[1];
		this.vision[17] = temp[2];

		temp = this.lookInDirection(new Vector2(0, 1));
		this.vision[18] = temp[0];
		this.vision[19] = temp[1];
		this.vision[20] = temp[2];

		temp = this.lookInDirection(new Vector2(-1, 1));
		this.vision[21] = temp[0];
		this.vision[22] = temp[1];
		this.vision[23] = temp[2];
	}

	lookInDirection(direction) {
		//look in a direction and check for food, body and wall
		let look = [0, 0, 0];
		let distance = 0;
		let pos = new Vector2(this.head.x, this.head.y);
		let foodFound = false;
		let bodyFound = false;

		pos.add(direction);
		distance +=1;

		while (!this.wallCollide(pos.x, pos.y)) {
			if (!foodFound && this.foodCollide(pos.x, pos.y)) {
				foodFound = true;
				look[0] = 1;
			}

			if (!bodyFound && this.bodyCollide(pos.x, pos.y)) {
				bodyFound = true;
				look[1] = 1;
			}

			pos.add(direction);
			distance +=1;
		}

		look[2] = 1 / distance;

		return look;
	}

	think() {
		// think about what direction to move
		let maxIndex = 0;
		let max = 0;

		this.decision = this.brain.output(this.vision);

		for (let i = 0; i < this.decision.length; ++i) {
			if (this.decision[i] > max) {
				max = this.decision[i];
				maxIndex = i;
			}
		}

		switch(maxIndex) {
			case 0:
				this.moveUp();
				break;
			case 1:
				this.moveDown();
				break;
			case 2:
				this.moveLeft();
				break;
			case 3:
				this.moveRight();
				break;
		}
	}

	moveUp() {
		if (this.yVel != 1) {
			this.xVel = 0;
			this.yVel = -1;
		}
	}

	moveDown() {
		if (this.yVel != -1) {
			this.xVel = 0;
			this.yVel = 1;
		}
	}

	moveLeft() {
		if (this.xVel != 1) {
			this.xVel = -1;
			this.yVel = 0;
		}
	}

	moveRight() {
		if (this.xVel != -1) {
			this.xVel = 1;
			this.yVel = 0;
		}
	}
}

export default Snake;
