import {dispatch} from 'nti-lib-dispatcher';
import {OrderedContents} from 'nti-lib-interfaces';
import {wait} from 'nti-commons';

import {maybeResetAssignmentOnError} from '../Actions';
import {partsEqual} from '../input-types';
import {removePartWithQuestionSet} from '../assignment-parts/Actions';
import {
	SAVING,
	SAVE_ENDED,
	QUESTION_UPDATED,
	QUESTION_ERROR,
	QUESTION_WARNING,
	QUESTION_SET_UPDATED,
	QUESTION_SET_ERROR,
	UNDO_CREATED
} from '../Constants';

import {cloneQuestion} from './utils';

function getQuestionSetFrom (NTIID, assignment) {
	const {parts} = assignment;

	if (!parts) { return null; }

	for (let part of parts) {
		if (part['question_set'].NTIID === NTIID) {
			return part['question_set'];
		}
	}
}

export function updateQuestion (question, fields, assignment, force) {
	const {content:oldContent, parts:oldParts} = question;
	const {content:newContent, parts:newParts} = fields;
	let values = {};

	if ((newContent || newContent === '') && newContent !== oldContent) {
		values.content = newContent;
	}

	if (newParts && !partsEqual(newParts, oldParts)) {
		values.parts = newParts;
	}

	if ((!values.content && values.content !== '') && !values.parts && !force) {
		return Promise.resolve();
	}

	dispatch(SAVING, question);

	return question.save(values)
		.catch(maybeResetAssignmentOnError(assignment || question))
		.then((newQuestion) => {
			dispatch(QUESTION_UPDATED, question);
			warnIfQuestionEmpty(newQuestion || question);
			dispatch(SAVE_ENDED, question);
		}).catch((reason) => {
			dispatch(QUESTION_ERROR, {
				NTIID: question.NTIID,
				field: 'parts',
				reason
			});
			dispatch(SAVE_ENDED, question);

			return Promise.reject(reason);
		});
}


export function deleteQuestionFrom (question, questionSet, assignment) {
	const orderedContents = new OrderedContents(questionSet);

	dispatch(QUESTION_UPDATED, question); // clear question errors/warnings

	if (orderedContents.canEdit && orderedContents.length === 1) {
		removePartWithQuestionSet(assignment, questionSet)
			.then((methods) => {
				if (methods.undo) {
					dispatch(UNDO_CREATED, {
						label: 'Question Deleted',
						name: 'Undo',
						onComplete: methods.undo,
						onTimeout: methods.cleanup
					});
				}
			});
	} else if (orderedContents.canEdit) {
		dispatch(SAVING, questionSet);

		orderedContents.remove(question)
			.catch(maybeResetAssignmentOnError(questionSet))
			.then((undo) => {
				dispatch(QUESTION_SET_UPDATED, questionSet);

				if (undo) {
					dispatch(UNDO_CREATED, {
						label: 'Question Deleted',
						name: 'Undo',
						onComplete: () => {
							const newQuestionSet = getQuestionSetFrom(questionSet.NTIID, assignment);

							if (newQuestionSet) {
								orderedContents.updateBackingObject(newQuestionSet);
								undo();
							}
						}
					});
				}

				dispatch(SAVE_ENDED);
			})
			.catch((reason) => {
				dispatch(QUESTION_SET_ERROR, reason);
				dispatch(SAVE_ENDED);
			});
	}
}


export function duplicateQuestionFrom (question, questionSet, delaySave) {
	//Make sure the blur event has been triggered
	wait(10)
		.then(() => {
			const orderedContents = new OrderedContents(questionSet);

			if (!orderedContents.canEdit) { return; }

			const clone = cloneQuestion(question);
			const {questions} = questionSet;
			let index;

			for (index = 0; index < questions.length; index++) {
				let q = questions[index];

				if (q.NTIID === question.NTIID) {
					break;
				}
			}

			dispatch(SAVING, questionSet);

			orderedContents.insertAt(clone, index + 1, delaySave)
				.catch(maybeResetAssignmentOnError(questionSet))
				.then(() => {
					dispatch(QUESTION_SET_UPDATED, questionSet);
					dispatch(SAVE_ENDED);
				})
				.catch((reason) => {
					dispatch(QUESTION_SET_ERROR, reason);
					dispatch(SAVE_ENDED);
				});
		});
}


export function detachSharedQuestion (question, questionSet, delaySave) {
	const orderedContents = new OrderedContents(questionSet);

	if (!orderedContents.canEdit) { return; }

	const clone = cloneQuestion(question);

	dispatch(SAVING, questionSet);

	orderedContents.replaceItem(question, clone, delaySave)
		.catch(maybeResetAssignmentOnError(questionSet))
		.then(() => {
			dispatch(QUESTION_SET_UPDATED, questionSet);
			dispatch(SAVE_ENDED);
		})
		.catch((reason) => {
			dispatch(QUESTION_ERROR, {NTIID: question.NTIID, field: 'parts', reason});
			dispatch(SAVE_ENDED);
		});
}


export function warnIfQuestionEmpty (question) {
	const {content} = question;

	if (!question.isSaving && !content) {
		dispatch(QUESTION_WARNING, {
			NTIID: question.NTIID,
			field: 'content',
			reason: {
				message: 'Questions cannot be blank.'
			}
		});
	}
}
