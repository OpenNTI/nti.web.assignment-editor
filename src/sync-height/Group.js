import {EventEmitter} from 'events';

const HEIGHTS = Symbol('Heights');
const CURRENT_HEIGHT = Symbol('Current Height');

export default class SyncHeightGroup extends EventEmitter {
	constructor (config = {}) {
		super();

		this.itemCount = 0;
		this.minHeight = config.minHeight || 0;

		this[HEIGHTS] = {};
		this[CURRENT_HEIGHT] = 0;
	}


	get height () {
		return this[CURRENT_HEIGHT];
	}


	getNewItem () {
		this.itemCount += 1;

		return this.itemCount;
	}


	sync () {
		const heights = this[HEIGHTS];
		const values = Object.values(heights);

		this[CURRENT_HEIGHT] = values.reduce((acc, height) => {
			if (height > acc) {
				acc = height;
			}

			return acc;
		}, this.minHeight);

		this.emit('sync-height');
	}


	setHeightFor (id, height) {
		const heights = this[HEIGHTS];
		const oldHeight = heights[id];

		heights[id] = height;

		if (oldHeight !== height) {
			this.sync();
		}
	}
}
