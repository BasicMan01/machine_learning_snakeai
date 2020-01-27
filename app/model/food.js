import Vector2 from '../classes/vector2.js';

class Food {
	constructor(tiles) {
		this.tiles = tiles;

		let x = Math.floor(Math.random() * this.tiles);
		let y = Math.floor(Math.random() * this.tiles);

		this.pos = new Vector2(x, y);
	}

	clone() {
		let clone = new Food(this.config);

		clone.pos.x = this.pos.x;
		clone.pos.y = this.pos.y;

		return clone;
    }
}

export default Food;