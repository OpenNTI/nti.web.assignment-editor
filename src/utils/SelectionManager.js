import {EventEmitter} from 'events';

const PRIVATE = new WeakMap();

export class SelectionItem extends EventEmitter {
	constructor (config) {
		super();

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
		this.emit('value-changed', value);

		PRIVATE.set(this, {
			id: this.id,
			value: value
		});
	}
}

export default class SelectionManager extends EventEmitter {
	constructor () {
		super();

		PRIVATE.set(this, {
			selectedItems: []
		});
	}


	select (items, keepCurrent) {
		let p = PRIVATE.get(this);

		if (!Array.isArray(items)) {
			items = [items];
		}


		let selectedMap = p.selectedItems.reduce((acc, item) => {
			acc[item.id] = true;

			return acc;
		}, {});

		let addedNew = false;

		p.selectedItems = items.reduce((acc, item) => {
			addedNew = addedNew || !selectedMap[item.id];

			if (!keepCurrent || !selectedMap[item.id]) {
				acc.push(item);
			}

			return acc;
		}, keepCurrent ? p.selectedItems : []);

		if (addedNew) {
			this.emit('selection-changed', p.selectedItems);
		}
	}


	unselect (items) {
		let p = PRIVATE.get(this);

		if (!Array.isArray(items)) {
			items = [items];
		}


		let unselectMap = items.reduce((acc, item) => {
			acc[item.id] = true;

			return acc;
		}, {});

		let itemRemoved = false;

		p.selectedItems = p.selectedItems.reduce((acc, item) => {
			if (!unselectMap[item.id]) {
				acc.push(item);
			} else {
				itemRemoved = true;
			}

			return acc;
		}, []);

		if (itemRemoved) {
			this.emit('selection-changed', p.selectedItems);
		}
	}


	isSelected (testItem) {
		let p = PRIVATE.get(this);

		//If every selected does not have the same id, the testItem is not selected
		return !p.selectedItems.every(item => testItem.id !== item.id);
	}



	getSelection (testItem) {
		let p = PRIVATE.get(this);
		let selection;

		if (!testItem) {
			selection = p.selectedItems;
		} else {
			selection = p.selectedItems.filter(item => item.id === testItem.id)[0];
		}

		return selection;
	}
}
