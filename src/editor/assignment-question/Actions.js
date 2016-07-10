import {dispatch} from 'nti-lib-dispatcher';

import OrderedContents from '../../ordered-contents';

import {saveFieldOn, warnIfQuestionEmpty} from '../Actions';
import {removePartWithQuestionSet} from '../assignment-parts/Actions';
import {
	SAVING,
	SAVE_ENDED,
	QUESTION_UPDATED,
	QUESTION_ERROR,
	QUESTION_SET_UPDATED,
	QUESTION_SET_ERROR,
	UNDO_CREATED
} from '../Constants';

import {cloneQuestion} from './utils';


export function saveQuestionContent (question, content) {
	const save = saveFieldOn(question, 'content', content);

	if (save && save.then) {
		save.then(() => {
			dispatch(QUESTION_UPDATED, question);
			warnIfQuestionEmpty(question);
		}).catch((reason) => {
			dispatch(QUESTION_ERROR, {
				NTIID: question.NTIID,
				field: 'content',
				reason
			});
		});
	}
}


export function deleteQuestionFrom (question, questionSet, assignment) {
	const orderedContents = new OrderedContents(questionSet);

	if (orderedContents.canEdit && orderedContents.length === 1) {
		removePartWithQuestionSet(assignment, questionSet)
			.then((undo) => {
				if (undo) {
					dispatch(UNDO_CREATED, {
						label: 'Question Deleted',
						name: 'Undo',
						onComplete: undo
					});
				}
			});
	} else if (orderedContents.canEdit) {
		dispatch(SAVING, questionSet);

		orderedContents.remove(question)
			.then((undo) => {
				dispatch(QUESTION_SET_UPDATED, questionSet);

				if (undo) {
					dispatch(UNDO_CREATED, {
						label: 'Question Deleted',
						name: 'Undo',
						onComplete: undo
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


export function duplicateQuestionFrom (question, questionSet) {
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

	orderedContents.insertAt(clone, index + 1)
		.then(() => {
			dispatch(QUESTION_SET_UPDATED, questionSet);
			dispatch(SAVE_ENDED);
		})
		.catch((reason) => {
			dispatch(QUESTION_SET_ERROR, reason);
			dispatch(SAVE_ENDED);
		});
}
