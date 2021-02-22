import StorePrototype from '@nti/lib-store';
import { Errors } from '@nti/web-commons';
import Logger from '@nti/util-logger';

import { Stack } from '../action-list';

import {
	FREE,
	LOADED,
	LOADED_COURSE,
	LOADED_SCHEMA,
	LOADING,
	SAVING,
	SAVE_ENDED,
	ASSIGNMENT_ERROR,
	ASSIGNMENT_UPDATED,
	ASSIGNMENT_DELETING,
	ASSIGNMENT_DELETED,
	ASSIGNMENT_WARNING,
	QUESTION_ERROR,
	QUESTION_UPDATED,
	QUESTION_WARNING,
	QUESTION_SET_ERROR,
	UNDO_CREATED,
	CLEAR_UNDOS,
	REVERT_ERRORS,
} from './Constants';

const SHORT = 3000;

const {
	Field: { Factory: ErrorFactory },
} = Errors;
const errorFactory = new ErrorFactory({
	overrides: {
		SchemaNotProvided: reason => {
			if (
				reason.field === 'value' &&
				reason.declared === 'IQFreeResponseSolution'
			) {
				return 'Short answer solutions cannot be empty';
			}
		},
	},
});

const PRIVATE = new WeakMap();
const logger = Logger.get('lib:asssignment-editor:Store');
const UNDO_STACK = new Stack({ maxVisible: 1, maxDepth: 5, keepFor: 30000 });

const ClearQuestionError = Symbol('Clear Question Error');
const ClearAssignmentError = Symbol('Clear Assignment Error');
const SetAssignment = Symbol('Set Assignment');
const SetAssignmentDeleting = Symbol('Set Assignment Deleting');
const SetAssignmentDeleted = Symbol('Set Assignment Deleted');
const SetCourse = Symbol('Set Course');
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
const ClearAssignment = Symbol('Clear Assignment');
const ClearUndos = Symbol('Clear Undos');
const RevertErrors = Symbol('Revert Errors');

function findMessagesForId(id, message) {
	return message[id] || [];
}

function findMessageForField(field, messages) {
	for (let message of messages) {
		if (message.isAttachedToField(field)) {
			return message;
		}
	}

	return null;
}

function getLabelForQuestionError(questionId, field, assignment) {
	const { parts } = assignment;
	const part = parts[0]; //For now just use the first part
	const questionSet = part && part.question_set;
	const questions = questionSet && questionSet.questions;

	for (let i = 0; i < questions.length; i++) {
		let question = questions[i];

		if (question.NTIID === questionId) {
			return `Question ${i + 1}`;
		}
	}
}

function getLabelForError(ntiid, field, label, type, assignment) {
	label = label || 'Error';

	if (type === QUESTION_ERROR || type === QUESTION_WARNING) {
		label = getLabelForQuestionError(ntiid, field, assignment);
	}

	//TODO: fill out the other types

	return label;
}

function init(instance) {
	UNDO_STACK.clear();

	PRIVATE.set(instance, {
		assignment: null,
		schema: null,
		deleting: false,
		deleted: false,
		savingCount: 0,
		savingStart: null,
		errors: {},
		warnings: {},
		openSince: new Date(),
	});

	global.AssignmentStore = instance;
}

class Store extends StorePrototype {
	constructor() {
		super();

		init(this);

		this.setAssignmentError = (...e) =>
			this[SetError](ASSIGNMENT_ERROR, ...e);
		this.setAssignmentWarning = (...e) =>
			this[SetWarning](ASSIGNMENT_WARNING, ...e);
		this.setQuestionSetError = (...e) =>
			this[SetError](QUESTION_SET_ERROR, ...e);
		this.setQuestionError = (...e) => this[SetError](QUESTION_ERROR, ...e);

		this.setQuestionWarning = (...w) =>
			this[SetWarning](QUESTION_WARNING, ...w);

		this.registerHandlers({
			[LOADED]: SetAssignment,
			[LOADED_COURSE]: SetCourse,
			[LOADED_SCHEMA]: SetSchema,
			[LOADING]: ClearAssignment,
			[FREE]: ClearAssignment,
			[SAVING]: SetSaving,
			[SAVE_ENDED]: SetSaveEnded,
			[ASSIGNMENT_UPDATED]: ClearAssignmentError,
			[ASSIGNMENT_DELETING]: SetAssignmentDeleting,
			[ASSIGNMENT_DELETED]: SetAssignmentDeleted,
			[ASSIGNMENT_ERROR]: 'setAssignmentError',
			[ASSIGNMENT_WARNING]: 'setAssignmentWarning',
			[QUESTION_ERROR]: 'setQuestionError',
			[QUESTION_UPDATED]: ClearQuestionError,
			[QUESTION_WARNING]: 'setQuestionWarning',
			[QUESTION_SET_ERROR]: 'setQuestionSetError',
			[UNDO_CREATED]: AddUndo,
			[CLEAR_UNDOS]: ClearUndos,
			[REVERT_ERRORS]: RevertErrors,
		});
	}

	[SetAssignment](e) {
		const { response } = e.action;
		let p = PRIVATE.get(this);

		if (response instanceof Error) {
			p.error = response;
		} else {
			p.assignment = response;
		}

		if (p.schema !== null || p.error) {
			this.emitChange({ type: LOADED });
		}
	}

	[SetCourse](e) {
		const { response } = e.action;
		let p = PRIVATE.get(this);

		p.course = response;
	}

	[SetSchema](e) {
		const { response } = e.action;
		let p = PRIVATE.get(this);

		if (response instanceof Error) {
			p.error = response;
		} else {
			p.schema = response;
		}

		if (p.assignment !== null || p.error) {
			this.emitChange({ type: LOADED });
		}

		this.emitChange({ type: LOADED_SCHEMA });
	}

	[SetAssignmentDeleting](e) {
		const deleting = e.action.response;
		let p = PRIVATE.get(this);

		p.deleting = deleting;

		this.emitChange({ type: ASSIGNMENT_DELETING });
	}

	[SetAssignmentDeleted]() {
		let p = PRIVATE.get(this);

		p.deleted = true;

		this.emitChange({ type: ASSIGNMENT_DELETED });
	}

	[SetSaving]() {
		let p = PRIVATE.get(this);
		const oldCount = p.savingCount;

		clearTimeout(this.endSavingTimeout);

		p.savingCount += 1;
		p.lastSaveStart = new Date();

		if (oldCount === 0) {
			this.emitChange({ type: SAVING });
		}
	}

	[SetSaveEnded]() {
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

	[StopSaveTimer]() {
		const p = PRIVATE.get(this);

		const endSave = () => {
			if (p.savingCount === 0) {
				this.emitChange({ type: SAVING });
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

	[GetMessageFrom](messages = {}, id, field) {
		const messagesForId = findMessagesForId(id, messages);
		let message;

		if (field) {
			message = findMessageForField(field, messagesForId);
		} else {
			message = messagesForId[0];
		}

		return message;
	}

	[ClearAssignmentError]() {
		const p = PRIVATE.get(this);
		const { assignment } = this;

		this[RemoveMessageFrom](
			p.errors,
			assignment.getID(),
			null,
			ASSIGNMENT_ERROR
		);
		this[RemoveMessageFrom](
			p.warnings,
			assignment.getID(),
			null,
			ASSIGNMENT_ERROR
		);
	}

	[ClearQuestionError](o) {
		const p = PRIVATE.get(this);
		const { response: question } = o.action;
		this[RemoveMessageFrom](
			p.errors,
			question.getID(),
			null,
			QUESTION_ERROR
		);
		this[RemoveMessageFrom](
			p.warnings,
			question.getID(),
			null,
			QUESTION_ERROR
		);
	}

	[RemoveMessageFrom](messages = {}, id, field, type) {
		if (!field) {
			delete messages[id];
		} else if (messages[id]) {
			messages[id] = messages[id].filter(
				message => !message.isAttachedToField(field)
			);
		}

		this.emitChange({ type: type, NTIID: id });

		return messages;
	}

	[SetMessageOn](messages = {}, message, type) {
		const { NTIID, field, label, reason } = message;

		if (!messages[NTIID]) {
			messages[NTIID] = [];
		}

		if (!this[GetMessageFrom](messages, NTIID, field)) {
			const { assignment } = this;
			messages[NTIID].push(
				errorFactory.make(
					{
						NTIID,
						field,
						type,
						get label() {
							return getLabelForError(
								NTIID,
								field,
								label,
								type,
								assignment
							);
						},
					},
					reason,
					() => this[RemoveMessageFrom](messages, NTIID, field, type)
				)
			);

			this.emitChange({ type: type, NTIID });
		}

		return messages;
	}

	[SetError](type, e) {
		const { response } = e.action;
		const p = PRIVATE.get(this);

		// Note: Do not show 409s,
		// since the user deals with them directly through a modal dialog
		if (!response || response.statusCode !== 409) {
			p.errors = this[SetMessageOn](p.errors, response, type);
		}
	}

	[SetWarning](type, e) {
		const { response } = e.action;
		const p = PRIVATE.get(this);

		p.warnings = this[SetMessageOn](p.warnings, response, type);
	}

	[AddUndo](e) {
		const undo = e.action.response;

		UNDO_STACK.push(undo);
	}

	[ClearAssignment]() {
		init(this);
	}

	[ClearUndos]() {
		UNDO_STACK.clear();
	}

	[RevertErrors]() {
		const p = PRIVATE.get(this);

		p.errors = {};

		this.emitChange({ type: REVERT_ERRORS });
	}

	get openSince() {
		const p = PRIVATE.get(this);

		return p.openSince;
	}

	get hasLoadError() {
		return !!this.loadError;
	}

	get isLoaded() {
		return !!this.assignment;
	}

	get assignment() {
		return PRIVATE.get(this).assignment;
	}

	get course() {
		return PRIVATE.get(this).course;
	}

	get schema() {
		return PRIVATE.get(this).schema;
	}

	get isSaving() {
		return PRIVATE.get(this).savingCount > 0;
	}

	get loadError() {
		return PRIVATE.get(this).error;
	}

	get undoStack() {
		return UNDO_STACK;
	}

	get errors() {
		const p = PRIVATE.get(this);
		const { errors } = p;
		const values = Object.values(errors);

		return values.reduce((acc, value) => {
			return [...acc, ...value];
		}, []);
	}

	get warnings() {
		const p = PRIVATE.get(this);
		const { warnings } = p;
		const values = Object.values(warnings);

		return values.reduce((acc, value) => {
			return [...acc, ...value];
		}, []);
	}

	get isDeleting() {
		const p = PRIVATE.get(this);
		return p.deleting;
	}

	getErrorFor(id, field) {
		const p = PRIVATE.get(this);

		return this[GetMessageFrom](p.errors, id, field);
	}

	getWarningFor(id, field) {
		const p = PRIVATE.get(this);

		return this[GetMessageFrom](p.warnings, id, field);
	}
}

export default new Store();
