import EventEmitter from 'events';

const PRIVATE = new WeakMap();

export default class SelectionItem extends EventEmitter {
	constructor (config) {
		super();
		this.setMaxListeners(1000);

		if (!config || config.id === undefined) {
			throw new Error('No ID provided to selection item');
		}

		config = config || {};

		PRIVATE.set(this, {
			id: config.id,
			value: config.value
		});

	}


	get id () {
		return PRIVATE.get(this).id;
	}


	get value () {
		return PRIVATE.get(this).value;
	}


	set value (value) {
		PRIVATE.set(this, {
			id: this.id,
			value: value
		});

		this.emit('updated', this);
	}
}
