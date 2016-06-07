import {LOADED, LOADED_SCHEMA, ASSIGNMENT_ERROR, QUESTION_ERROR} from './Constants';
import StorePrototype from 'nti-lib-store';

const PRIVATE = new WeakMap();
const SetAssignment = Symbol('Set Assignment');
const SetSchema = Symbol('Set Assignment Schema');
const SetError = Symbol('Set Error');
const RemoveError = Symbol('Remove Error');


function findErrorsForId (id, errors) {
	return errors[id] || [];
}


function findErrorForField (field, errors) {
	for (let error of errors) {
		if (error.field === field) {
			return error;
		}
	}

	return null;
}


class Store extends StorePrototype {
	constructor () {
		super();

		PRIVATE.set(this, {
			assignment: null,
			schema: null,
			errors: {}
		});

		this.setAssignmentError = this[SetError].bind(this, ASSIGNMENT_ERROR);
		this.setQuestionError = this[SetError].bind(this, QUESTION_ERROR);

		this.registerHandlers({
			[LOADED]: SetAssignment,
			[LOADED_SCHEMA]: SetSchema,
			[ASSIGNMENT_ERROR]: 'setAssignmentError',
			[QUESTION_ERROR]: 'setQuestionError'
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


	[SetError] (type, e) {
		const error = e.action.response;
		const {NTIID, field, reason} = error;
		let p = PRIVATE.get(this);

		p.errors = p.errors || {};

		if (!p.errors[NTIID]) {
			p.errors[NTIID] = [];
		}

		if (!this.getErrorFor(NTIID, field)) {
			p.errors[NTIID].push({
				NTIID,
				field,
				reason,
				clear: () => this[RemoveError](NTIID, field, type)
			});

			this.emitChange({type: type});
		}
	}


	[RemoveError] (id, field, type) {
		let p = PRIVATE.get(this);
		let {errors} = p;

		errors = errors || {};

		if (!field) {
			delete errors[id];
		} else if (errors[id]) {
			errors[id] = errors[id].filter(error => error.field !== field);
		}

		this.emitChange({type: type});
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


	getErrorFor (id, field) {
		let p = PRIVATE.get(this);
		let {errors} = p;
		let error;

		errors = errors || {};

		let errorsForId = findErrorsForId(id, errors);

		if (field) {
			error = findErrorForField(field, errorsForId);
		} else {
			error = errorsForId[0];
		}

		return error;
	}
}

export default new Store();
