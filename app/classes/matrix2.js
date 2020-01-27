class Matrix2 {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;

		this.matrix = [];

		for (let i = 0; i < this.rows; ++i) {
			this.matrix[i] = [];

			for (let j = 0; j < this.cols; ++j) {
				this.matrix[i][j] = 0;
			}
		}
	}

	output() {
		console.table(this.matrix);
	}

	dot(m) {
		let result = new Matrix2(this.rows, m.cols);

		if (this.cols === m.rows) {
			for (let i = 0; i < this.rows; ++i) {
				for (let j = 0; j < m.cols; ++j) {
					let sum = 0;

					for (let k = 0; k < this.cols; ++k) {
						sum += this.matrix[i][k] * m.matrix[k][j];
					}

					result.matrix[i][j] = sum;
				}
			}
		}

		return result;
	}

	randomize() {
		for (let i = 0; i < this.rows; ++i) {
			for (let j = 0; j < this.cols; ++j) {
				this.matrix[i][j] = 1 - Math.random() * 2;
			}
		}
	}

	singleColumnMatrixFromArray(arr) {
		let m = new Matrix2(arr.length, 1);

		for (let i = 0; i < arr.length; ++i) {
			m.matrix[i][0] = arr[i];
		}

		return m;
	}

	toArray() {
		let arr = [];

		for (let i = 0; i < this.rows; ++i) {
			for (let j = 0; j < this.cols; ++j) {
				arr[j + i * this.cols] = this.matrix[i][j];
			}
		}

		return arr;
	}

	addBias() {
		let m = new Matrix2(this.rows + 1, 1);

		for (let i = 0; i < this.rows; ++i) {
			m.matrix[i][0] = this.matrix[i][0];
		}

		m.matrix[this.rows][0] = 1;

		return m;
	}

	activate() {
		let m = new Matrix2(this.rows, this.cols);

		for (let i = 0; i < this.rows; ++i) {
			for (let j = 0; j < this.cols; ++j) {
				m.matrix[i][j] = this.relu(this.matrix[i][j]);
			}
		}

		return m;
	}

	relu(x) {
		return x > 0 ? x : 0;
	}

	gaussianRand() {
		let u = 0;
		let v = 0;

		while (u === 0) {
			u = Math.random();
		}

		while (v === 0) {
			v = Math.random();
		}

		return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	}

	mutate(mutationRate) {
		for (let i = 0; i < this.rows; ++i) {
			for (let j = 0; j < this.cols; ++j) {
				let rand = Math.random();

				if (rand < mutationRate) {
					this.matrix[i][j] += this.gaussianRand() / 5;

					if (this.matrix[i][j] > 1) {
						this.matrix[i][j] = 1;
					}

					if (this.matrix[i][j] < -1) {
						this.matrix[i][j] = -1;
					}
				}
			}
		}
	}

	crossover(partner) {
		let child = new Matrix2(this.rows, this.cols);

		let randC = Math.floor(Math.random() * this.cols);
		let randR = Math.floor(Math.random() * this.rows);

		for (let i = 0; i < this.rows; ++i) {
			for (let j = 0; j < this.cols; ++j) {
				if ((i  < randR) || (i == randR && j <= randC)) {
					child.matrix[i][j] = this.matrix[i][j];
				} else {
					child.matrix[i][j] = partner.matrix[i][j];
				}
			}
		}

		return child;
	}

	clone() {
		let clone = new Matrix2(this.rows, this.cols);

		for (let i = 0; i < this.rows; ++i) {
			for (let j = 0; j < this.cols; ++j) {
				clone.matrix[i][j] = this.matrix[i][j];
			}
		}

		return clone;
	}
}

export default Matrix2;