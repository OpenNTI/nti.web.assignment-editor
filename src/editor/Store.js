import {LOADED, LOADED_SCHEMA} from './Constants';
import StorePrototype from 'nti-lib-store';

const PRIVATE = new WeakMap();
const SetAssignment = Symbol('Set Assignment');
const SetSchema = Symbol('Set Assignment Schema');


class Store extends StorePrototype {
	constructor () {
		super();

		PRIVATE.set(this, {
			assignment: null,
			schema: null,
			error: null
		});

		this.registerHandlers({
			[LOADED]: SetAssignment,
			[LOADED_SCHEMA]: SetSchema
		});
	}


	[SetAssignment] (e) {
		const assignment = e.action.response;
		let p = PRIVATE.get(this);


		if (assignment instanceof Error) {
			p.error = assignment;
		} else {
			p.assignment = assignment;
		}

		if (p.schema !== null) {
			this.emitChange({type: LOADED});
		}
	}


	[SetSchema] (e) {
		const schema = e.action.response;
		let p = PRIVATE.get(this);

		if (!(schema instanceof Error)) {
			p.schema = schema;
		}

		if (p.assignment !== null) {
			this.emitChange({type: LOADED});
		}

		this.emitChange({type: LOADED_SCHEMA});
	}


	get isLoaded () {
		let p = PRIVATE.get(this);

		return !!p.assignment;
	}


	get assignment () {
		let p = PRIVATE.get(this);

		return p.assignment;
	}


	get schema () {
		let p = PRIVATE.get(this);

		return p.schema;
	}


	get error () {
		let p = PRIVATE.get(this);

		return p.error;
	}
}

export default new Store();
