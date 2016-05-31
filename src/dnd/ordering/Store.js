import {DRAG_OVER, DRAG_LEAVE} from './Constants';
import StorePrototype from 'nti-lib-store';

const PRIVATE = new WeakMap();
const SetActiveOrdering = Symbol('Set Active Ordering');
const RemoveActiveOrdering = Symbol('Remove Active Ordering');

class Store extends StorePrototype {
	constructor () {
		super();

		PRIVATE.set(this, {
			activeOrdering: null
		});

		this.registerHandlers({
			[DRAG_OVER]: SetActiveOrdering,
			[DRAG_LEAVE]: RemoveActiveOrdering
		});
	}


	[SetActiveOrdering] (e) {
		const active = e.action.response;
		let p = PRIVATE.get(this);
		let currentActive = p.active;

		if (currentActive !== active) {
			p.active = active;
			this.emitChange({type: DRAG_OVER});
		}
	}

	[RemoveActiveOrdering] (e) {
		const active = e.action.response;
		let p = PRIVATE.get(this);
		let currentActive = p.active;

		if (currentActive === active) {
			p.active = null;
			this.emitChange({type: DRAG_LEAVE});
		}
	}


	get activeOrdering () {
		let p = PRIVATE.get(this);

		return p.active;
	}
}

export default new Store();
