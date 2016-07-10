import StorePrototype from 'nti-lib-store';
import {Errors} from 'nti-web-commons';
import {Queue} from '../action-queue';
import Logger from 'nti-util-logger';

import {
	LOADED,
	LOADED_SCHEMA,
	SAVING,
	SAVE_ENDED,
	ASSIGNMENT_ERROR,
	ASSIGNMENT_DELETING,
	ASSIGNMENT_DELETED,
	QUESTION_ERROR,
	QUESTION_WARNING,
	UNDO_CREATED,
	CLEAR_UNDOS
} from './Constants';

const SHORT = 3000;

const {Field: {Factory:ErrorFactory}} = Errors;
const errorFactory = new ErrorFactory();

const PRIVATE = new WeakMap();
const logger = Logger.get('lib:asssignment-editor:Store');

const SetAssignment = Symbol('Set Assignment');
const SetAssignmentDeleting = Symbol('Set Assignment Deleting');
const SetAssignmentDeleted = Symbol('Set Assignment Deleted');
const SetSchema = Symbol('Set Assignment Schema');
const SetSaving = Symbol('Set Saving');
const SetSaveEnded = Symbol('Set Save Ended');
const StopSaveTimer = Symbol('Stop Save Timer');
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
		if (message.isAttachedToField(field)) {
			return message;
		}
	}

	return null;
}


function getLabelForQuestionError (questionId, field, assignment) {
	const {parts} = assignment;
	const part = parts[0];//For now just use the first part
	const questionSet = part && part.question_set;
	const questions = questionSet && questionSet.questions;

	for (let i = 0; i < questions.length; i++) {
		let question = questions[i];

		if (question.NTIID === questionId) {
			return `Question ${i + 1}`;
		}
	}
}


function getLabelForError (ntiid, field, label, type, assignment) {
	label = label || 'Error';

	if (type === QUESTION_ERROR) {
		label = getLabelForQuestionError(ntiid, field, assignment);
	}

	//TODO: fill out the other types

	return label;
}


class Store extends StorePrototype {
	constructor () {
		super();

		PRIVATE.set(this, {
			assignment: null,
			schema: null,
			deleting: false,
			deleted: false,
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
			[ASSIGNMENT_DELETING]: SetAssignmentDeleting,
			[ASSIGNMENT_DELETED]: SetAssignmentDeleted,
			[ASSIGNMENT_ERROR]: 'setAssignmentError',
			[QUESTION_ERROR]: 'setQuestionError',
			[QUESTION_WARNING]: 'setQuestionWarning',
			[UNDO_CREATED]: AddUndo,
			[CLEAR_UNDOS]: ClearUndos
		});
	}


	[SetAssignment] (e) {
		const {response} = e.action;
		let p = PRIVATE.get(this);


		if (response instanceof Error) {
			p.error = response;
		} else {
			p.assignment = response;
		}

		if (p.schema !== null || p.error) {
			this.emitChange({type: LOADED});
		}
	}


	[SetSchema] (e) {
		const {response} = e.action;
		let p = PRIVATE.get(this);

		if (response instanceof Error) {
			p.error = response;
		} else {
			p.schema = response;
		}

		if (p.assignment !== null || p.error) {
			this.emitChange({type: LOADED});
		}

		this.emitChange({type: LOADED_SCHEMA});
	}


	[SetAssignmentDeleting] (e) {
		const deleting = e.action.response;
		let p = PRIVATE.get(this);

		p.deleting = deleting;

		this.emitChange({type: ASSIGNMENT_DELETING});
	}


	[SetAssignmentDeleted] () {
		let p = PRIVATE.get(this);

		p.deleted = true;

		this.emitChange({type: ASSIGNMENT_DELETED});
	}


	[SetSaving] () {
		let p = PRIVATE.get(this);
		const oldCount = p.savingCount;

		clearTimeout(this.endSavingTimeout);

		p.savingCount += 1;
		p.lastSaveStart = new Date();

		if (oldCount === 0) {
			this.emitChange({type: SAVING});
		}
	}


	[SetSaveEnded] () {
		let p = PRIVATE.get(this);

		const oldCount = p.savingCount;
		const newCount = oldCount === 0 ? 0 : oldCount - 1;

		if (oldCount === 0) {
			logger.warn('SaveEnded called more times than SaveStarted');
		}

		p.savingCount = newCount;

		if (newCount === 0) {
			this[StopSaveTimer]();
		}
	}


	[StopSaveTimer] () {
		const p = PRIVATE.get(this);

		const endSave = () => {
			if (p.savingCount === 0) {
				this.emitChange({type: SAVING});
			}
		};

		const now = new Date();
		const start = p.lastSaveStart || new Date(0);
		const savingTime = now - start;

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
			messages[id] = messages[id].filter(message => !message.isAttachedToField(field));
		}

		this.emitChange({type: type});

		return messages;
	}


	[SetMessageOn] (messages = {}, message, type) {
		const {NTIID, field, label, reason} = message;

		if (!messages[NTIID]) {
			messages[NTIID] = [];
		}

		if (!this[GetMessageFrom](messages, NTIID, field)) {
			//TODO: update the label when the questionSet's order changes
			messages[NTIID].push(errorFactory.make(
				{NTIID, field, type, label: getLabelForError(NTIID, field, label, type, this.assignment)},
				reason,
				() => this[RemoveMessageFrom](messages, NTIID, field, type)
			));

			this.emitChange({type: type});
		}

		return messages;
	}


	[SetError] (type, e) {
		const {response} = e.action;
		const p = PRIVATE.get(this);

		p.errors = this[SetMessageOn](p.errors, response, type);
	}



	[SetWarning] (type, e) {
		const {response} = e.action;
		const p = PRIVATE.get(this);

		p.warnings = this[SetMessageOn](p.warnings, response, type);
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


	get hasLoadError () {
		const p = PRIVATE.get(this);

		return !!p.error;
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


	get loadError () {
		const p = PRIVATE.get(this);

		return p.error;
	}


	get undoQueue () {
		const p = PRIVATE.get(this);

		return p.undoQueue;
	}


	get errors () {
		const p = PRIVATE.get(this);
		const {errors} = p;
		const values = Object.values(errors);

		return values.reduce((acc, value) => {
			return [...acc, ...value];
		}, []);
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
