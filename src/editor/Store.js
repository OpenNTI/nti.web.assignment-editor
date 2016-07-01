import StorePrototype from 'nti-lib-store';
import {Queue} from '../action-queue';

import {
	LOADED,
	LOADED_SCHEMA,
	ASSIGNMENT_ERROR,
	QUESTION_ERROR,
	QUESTION_WARNING,
	UNDO_CREATED,
	CLEAR_UNDOS
} from './Constants';

const PRIVATE = new WeakMap();
const SetAssignment = Symbol('Set Assignment');
const SetSchema = Symbol('Set Assignment Schema');
const SetError = Symbol('Set Error');
const SetWarning = Symbol('Set Warning');
const GetMessageFrom = Symbol('Get Message From');
const RemoveMessageFrom = Symbol('Remove Message From');
const SetMessageOn = Symbol('Set Message On');
const AddUndo = Symbol('Add Undo');
const ClearUndos = Symbol('Clear Undos');


function getMessageForReason (reason) {
	return (reason && reason.message) || 'Unknown Error';
}


function findMessagesForId (id, message) {
	return message[id] || [];
}


function findMessageForField (field, messages) {
	for (let message of messages) {
		if (message.field === field) {
			return message;
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
			errors: {},
			warnings: {},
			undoQueue: new Queue({maxVisible: 1, maxDepth: 5, keepFor: 30000})
		});

		this.setAssignmentError = this[SetError].bind(this, ASSIGNMENT_ERROR);
		this.setQuestionError = this[SetError].bind(this, QUESTION_ERROR);

		this.setQuestionWarning = this[SetWarning].bind(this, QUESTION_WARNING);

		this.registerHandlers({
			[LOADED]: SetAssignment,
			[LOADED_SCHEMA]: SetSchema,
			[ASSIGNMENT_ERROR]: 'setAssignmentError',
			[QUESTION_ERROR]: 'setQuestionError',
			[QUESTION_WARNING]: 'setQuestionWarning',
			[UNDO_CREATED]: AddUndo,
			[CLEAR_UNDOS]: ClearUndos
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


	[GetMessageFrom] (messages = {}, id, field) {
		const messagesForId = findMessagesForId(id, messages);
		let message;

		if (field) {
			message = findMessageForField(field, messagesForId);
		} else {
			message = messagesForId[0];
		}

		return message;
	}


	[RemoveMessageFrom] (messages = {}, id, field, type) {
		if (!field) {
			delete messages[id];
		} else if (messages[id]) {
			messages[id] = messages[id].filter(message => message.field !== field);
		}

		this.emitChange({type: type});

		return messages;
	}


	[SetMessageOn] (messages = {}, message, type) {
		const {NTIID, field, reason} = message;

		if (!messages[NTIID]) {
			messages[NTIID] = [];
		}

		if (!this[GetMessageFrom](messages, NTIID, field)) {
			messages[NTIID].push({
				NTIID,
				field,
				reason,
				message: getMessageForReason(reason),
				clear: () => this[RemoveMessageFrom](messages, NTIID, field, type)
			});

			this.emitChange({type: type});
		}

		return messages;
	}


	[SetError] (type, e) {
		const error = e.action.response;
		const p = PRIVATE.get(this);

		p.errors = this[SetMessageOn](p.errors, error, type);
	}



	[SetWarning] (type, e) {
		const warning = e.action.response;
		const p = PRIVATE.get(this);

		p.warnings = this[SetMessageOn](p.warnings, warning, type);
	}


	[AddUndo] (e) {
		const undo = e.action.response;
		const p = PRIVATE.get(this);
		const {undoQueue} = p;

		undoQueue.push(undo);
	}


	[ClearUndos] () {
		const p = PRIVATE.get(this);
		const {undoQueue} = p;

		undoQueue.clear();
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


	get undoQueue () {
		const p = PRIVATE.get(this);

		return p.undoQueue;
	}


	getErrorFor (id, field) {
		const p = PRIVATE.get(this);

		return this[GetMessageFrom](p.errors, id, field);
	}


	getWarningFor (id, field) {
		const p = PRIVATE.get(this);

		return this[GetMessageFrom](p.warnings, id, field);
	}
}

export default new Store();
