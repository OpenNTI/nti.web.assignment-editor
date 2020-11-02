import EventEmitter from 'events';

import {v4 as guid} from 'uuid';

export default class SelectionItem extends EventEmitter {
	#id;
	#value;

	constructor (config) {
		super();
		this.setMaxListeners(1000);

		this.#id =  config?.id || guid();
		this.#value = config?.value;
	}


	get id () {
		return this.#id;
	}


	get value () {
		return this.#value;
	}


	set value (value) {
		this.#value = value;
		this.emit('updated', this);
	}
}
