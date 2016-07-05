import StorePrototype from 'nti-lib-store';
import {ErrorFactory} from 'nti-web-commons';
import {Queue} from '../action-queue';
import Logger from 'nti-util-logger';

import {
	LOADED,
	LOADED_SCHEMA,
	SAVING,
	SAVE_ENDED,
	ASSIGNMENT_ERROR,
	QUESTION_ERROR,
	QUESTION_WARNING,
	UNDO_CREATED,
	CLEAR_UNDOS
} from './Constants';

const SHORT = 3000;

const errorFactory = new ErrorFactory();

const PRIVATE = new WeakMap();
const logger = Logger.get('lib:asssignment-editor:Store');

const SetAssignment = Symbol('Set Assignment');
const SetSchema = Symbol('Set Assignment Schema');
const SetSaving = Symbol('Set Saving');
const SetSaveEnded = Symbol('Set Save Ended');
const SetError = Symbol('Set Error');
const SetWarning = Symbol('Set Warning');
const GetMessageFrom = Symbol('Get Message From');
const RemoveMessageFrom = Symbol('Remove Message From');
const SetMessageOn = Symbol('Set Message On');
const AddUndo = Symbol('Add Undo');
const ClearUndos = Symbol('Clear Undos');


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
			savingCount: 0,
			savingStart: null,
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
			[SAVING]: SetSaving,
			[SAVE_ENDED]: SetSaveEnded,
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


	[SetSaving] () {
		let p = PRIVATE.get(this);
		const oldCount = p.savingCount;

		clearTimeout(this.endSavingTimeout);

		p.savingCount += 1;

		if (oldCount === 0) {
			p.savingStart = new Date();
			this.emitChange({type: SAVING});
		}
	}


	[SetSaveEnded] () {
		let p = PRIVATE.get(this);

		const endSave = () => {
			const oldCount = p.savingCount;
			let newCount;

			if (oldCount === 0) {
				logger.error('More save ends than set savings called.');
				newCount = 0;
			} else {
				newCount = oldCount - 1;
			}

			p.savingCount = newCount;

			if (newCount !== oldCount) {
				this.emitChange({type: SAVING});
			}
		};

		const now = new Date();
		const started = p.savingStart ||  new Date(0);
		const savingTime = now - started;

		clearTimeout(this.endSavingTimeout);

		if (savingTime < SHORT) {
			this.endSavingTimeout = setTimeout(endSave, SHORT - savingTime);
		} else {
			endSave();
		}
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
			messages[NTIID].push(errorFactory.make(
					NTIID,
					field,
					reason,
					() => this[RemoveMessageFrom](messages, NTIID, field, type)
				));

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
		const p = PRIVATE.get(this);

		return !!p.assignment;
	}


	get assignment () {
		const p = PRIVATE.get(this);

		return p.assignment;
	}


	get schema () {
		const p = PRIVATE.get(this);

		return p.schema;
	}


	get isSaving () {
		const p = PRIVATE.get(this);

		return p.savingCount > 0;
	}


	get undoQueue () {
		const p = PRIVATE.get(this);

		return p.undoQueue;
	}


	get errors () {
		//TODO: figure this out
		return [];
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
