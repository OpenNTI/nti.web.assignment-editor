import {ORDERING_DRAG_OVER, ORDERING_DRAG_LEAVE, DROP_HANDLED} from './Constants';
import StorePrototype from 'nti-lib-store';
import {MimeType as MoveInfoMimeType} from './utils/MoveInfo';
import {MimeType as InfoMimeType} from './utils/Info';
import {getTransferKey, isSameData} from './utils/DataTransfer';

const ActiveOrdering = Symbol('Active Ordering');
const HandledDrops = Symbol('Handled Drops');
const ClearHandlesTimeout = Symbol('Clear Handles Timeout');
const SetActiveOrdering = Symbol('Set Active Ordering');
const RemoveActiveOrdering = Symbol('Remove Active Ordering');
const DropHandled = Symbol('Drop Handled');

const clearHandles = 100;

class Store extends StorePrototype {
	constructor () {
		super();



		this.registerHandlers({
			[ORDERING_DRAG_OVER]: SetActiveOrdering,
			[ORDERING_DRAG_LEAVE]: RemoveActiveOrdering,
			[DROP_HANDLED]: DropHandled
		});
	}


	[SetActiveOrdering] (e) {
		const active = e.action.response;
		let currentActive = this[ActiveOrdering];

		if (currentActive !== active) {
			this[ActiveOrdering] = active;
			this.emitChange({type: ORDERING_DRAG_OVER});
		}
	}

	[RemoveActiveOrdering] (e) {
		const active = e.action.response;
		let currentActive = this[ActiveOrdering];

		if (currentActive === active) {
			this[ActiveOrdering] = null;
			this.emitChange({type: ORDERING_DRAG_LEAVE});
		}
	}

	[DropHandled] (e) {
		const data = e.action.response;
		const types = filtered(data.types, x => x !== MoveInfoMimeType && x !== InfoMimeType);

		// >< firefox returns a DomStringList for data.types;
		// DomStringLists don't have a filter method.
		function filtered (input, filterFn) {
			if (input.filter) {
				return input.filter(filterFn);
			}

			const result = [];
			for (let i = 0; i < input.length; i++) {
				let item = input.item(i);
				if(filterFn(item)) {
					result.push(item);
				}
			}
			return result;
		}

		clearTimeout(this[ClearHandlesTimeout]);

		this[HandledDrops] = types.reduce((acc, type) => {
			acc[type] = data.findDataFor(type);
			return acc;
		}, this[HandledDrops] || {});

		this.emitChange({type: DROP_HANDLED});

		this[ClearHandlesTimeout] = setTimeout(() => {
			this[HandledDrops] = null;
		}, clearHandles);
	}


	wasDataHandled (data) {
		const key = getTransferKey(data);
		const handled = (this[HandledDrops] && this[HandledDrops][key]) || {};

		return handled && isSameData(data, handled);
	}


	get activeOrdering () {
		return this[ActiveOrdering];
	}
}

export default new Store();
