import Config from '../model/config.js';
import Population from '../model/population.js';
import View from '../view/view.js';


class Controller {
	constructor() {
		this.config = new Config();

		this.init();
	}

	init() {
		this.model = new Population(this.config, 2000);
		this.view = new View(this.config, this.model);

		// game
		this.view.addCallback('increaseMutationAction', this.increaseMutationAction.bind(this));
		this.view.addCallback('decreaseMutationAction', this.decreaseMutationAction.bind(this));
	}

	increaseMutationAction() {
		this.config.increaseMutation();
	}

	decreaseMutationAction() {
		this.config.decreaseMutation();
	}
}

export default Controller;