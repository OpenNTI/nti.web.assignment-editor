import EventEmitter from 'events';

const HEIGHTS = Symbol('Heights');
const CURRENT_HEIGHT = Symbol('Current Height');

export default class SyncHeightGroup extends EventEmitter {
	constructor(config = {}) {
		super();

		this.itemCount = 0;
		this.minHeight = config.minHeight || 0;

		this[HEIGHTS] = {};
		this[CURRENT_HEIGHT] = 0;
	}

	get height() {
		return this[CURRENT_HEIGHT];
	}

	getNewItem() {
		this.itemCount += 1;

		return this.itemCount;
	}

	maybeEmitSync() {
		if (this.itemCount > 1) {
			this.emit('sync-height');
		}
	}

	sync() {
		const heights = this[HEIGHTS];
		const values = Object.values(heights);
		const newHeight = values.reduce((acc, height) => {
			if (height > acc) {
				acc = height;
			}

			return acc;
		}, this.minHeight);

		if (this[CURRENT_HEIGHT] !== newHeight) {
			this[CURRENT_HEIGHT] = newHeight;
			this.maybeEmitSync();
		}
	}

	setHeightFor(id, height) {
		const heights = this[HEIGHTS];
		const oldHeight = heights[id];

		heights[id] = height;

		if (oldHeight !== height) {
			this.sync();
		}
	}
}
