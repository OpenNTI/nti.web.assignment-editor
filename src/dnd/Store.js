import StorePrototype from '@nti/lib-store';

import {
	ORDERING_DRAG_OVER,
	ORDERING_DRAG_LEAVE,
	DROP_HANDLED,
	DRAG_START,
	DRAG_END,
} from './Constants';
import { MimeType as MoveInfoMimeType } from './utils/MoveInfo';
import { MimeType as InfoMimeType } from './utils/Info';
import { getTransferKey, isSameData } from './utils/DataTransfer';

const ActiveOrdering = Symbol('Active Ordering');
const HandledDrops = Symbol('Handled Drops');
const ClearHandlesTimeout = Symbol('Clear Handles Timeout');
const SetActiveOrdering = Symbol('Set Active Ordering');
const RemoveActiveOrdering = Symbol('Remove Active Ordering');
const DropHandled = Symbol('Drop Handled');
const DragStart = Symbol('Drag Start');
const DragEnd = Symbol('Drag End');

const clearHandles = 100;

class Store extends StorePrototype {
	constructor() {
		super();

		this.registerHandlers({
			[ORDERING_DRAG_OVER]: SetActiveOrdering,
			[ORDERING_DRAG_LEAVE]: RemoveActiveOrdering,
			[DROP_HANDLED]: DropHandled,
			[DRAG_START]: DragStart,
			[DRAG_END]: DragEnd,
		});
	}

	[SetActiveOrdering](e) {
		const active = e.action.response;
		let currentActive = this[ActiveOrdering];

		if (currentActive !== active) {
			this[ActiveOrdering] = active;
			this.emitChange({ type: ORDERING_DRAG_OVER });
		}
	}

	[RemoveActiveOrdering](e) {
		const active = e.action.response;
		let currentActive = this[ActiveOrdering];

		if (currentActive === active) {
			this[ActiveOrdering] = null;
			this.emitChange({ type: ORDERING_DRAG_LEAVE });
		}
	}

	[DropHandled](e) {
		const data = e.action.response;
		const types = Array.from(data.types).filter(
			x => x !== MoveInfoMimeType && x !== InfoMimeType
		);

		clearTimeout(this[ClearHandlesTimeout]);

		this[HandledDrops] = types.reduce((acc, type) => {
			acc[type] = data.findDataFor(type);
			return acc;
		}, this[HandledDrops] || {});

		this.emitChange({ type: DROP_HANDLED });

		this[ClearHandlesTimeout] = setTimeout(() => {
			this[HandledDrops] = null;
		}, clearHandles);
	}

	[DragStart]() {
		this.hasActiveDrag = true;

		this.emitChange({ type: DRAG_START });
	}

	[DragEnd]() {
		this.hasActiveDrag = false;

		this.emitChange({ type: DRAG_END });
	}

	wasDataHandled(data) {
		const key = getTransferKey(data);
		const handled = (this[HandledDrops] && this[HandledDrops][key]) || {};

		return handled && isSameData(data, handled);
	}

	get activeOrdering() {
		return this[ActiveOrdering];
	}
}

export default new Store();
