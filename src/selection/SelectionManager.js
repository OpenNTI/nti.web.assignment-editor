import EventEmitter from 'events';
import Logger from 'nti-util-logger';

const PRIVATE = new WeakMap();
const MonitorItem = Symbol('Monitor Item');
const UnmonitorItem = Symbol('Unmonitor Item');
const ItemUpdated = Symbol('Item Updated');
const logger = Logger.get('lib:asssignment-editor:utils:SelectionManager');

export default class SelectionManager extends EventEmitter {
	constructor () {
		super();
		this.setMaxListeners(1000);

		PRIVATE.set(this, {
			selectedItems: []
		});

		this[ItemUpdated] = this[ItemUpdated].bind(this);
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
				this[MonitorItem](item);
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
				this[UnmonitorItem](item);
				itemRemoved = true;
			}

			return acc;
		}, []);

		if (itemRemoved) {
			this.emit('selection-changed', p.selectedItems);
		}
	}


	selectId (id) {
		this.emit('select-item', id);
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


	[MonitorItem] (item) {
		if (item.addListener) {
			item.addListener('updated', this[ItemUpdated]);
		} else {
			logger.warn('Selection item does not have addListener');
		}
	}


	[UnmonitorItem] (item) {
		if (!item.removeListener) {
			item.removeListener('updated', this[ItemUpdated]);
		} else {
			logger.warn('Selection item does not have removeListener');
		}
	}


	[ItemUpdated] (item) {
		const p = PRIVATE.get(this);

		if (this.isSelected(item)) {
			this.emit('selection-changed', p.selectedItems);
		} else {
			logger.warn('Got update event for item that is not selected');
			this[UnmonitorItem](item);
		}
	}
}
