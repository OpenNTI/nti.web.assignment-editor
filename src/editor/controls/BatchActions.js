import EventEmitter from 'events';

const Actions = Symbol('Actions');
const Queue = Symbol('Queue');
const Batch = Symbol('Batch');

export default class BatchActions extends EventEmitter {
	constructor () {
		super();

		this[Queue] = [];
		this[Actions] = {};
	}


	get shouldBatch () {
		return this[Batch];
	}


	set shouldBatch (value) {
		this[Batch] = !!value;
	}


	preformAction (fn, key) {
		if (this.shouldBatch) {
			this.batchAction(fn, key);
		} else {
			fn();
		}
	}


	batchAction (fn, key) {
		if (key && this[Actions][key]) {
			this[Actions][key] = fn;
		} else if (key) {
			this[Actions][key] = fn;
			this[Queue].push(key);
		} else {
			this[Queue].push(fn);
		}

		this.emit('changed');
	}


	preformAll () {
		const actions = this[Actions];
		const queue = this[Queue];

		for (let action of queue) {
			let fn = typeof action === 'string' ? actions[action] : action;

			if (fn) {
				fn();
			}
		}
	}
}
