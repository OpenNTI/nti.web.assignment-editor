import {dispatch} from 'nti-lib-dispatcher';
import Logger from 'nti-util-logger';

import {getEqualityCheck} from './index';
import {SAVING, SAVE_ENDED, QUESTION_SET_UPDATED, QUESTION_SET_ERROR, QUESTION_UPDATED, QUESTION_ERROR} from '../Constants';
import OrderedContents from '../utils/OrderedContents';
import {createPartWithQuestion} from '../assignment-parts/Actions';

const logger = Logger.get('assignment-inputs:Actions');

function insertAt (assignment, part, index, question) {
	if (!part) {
		createPartWithQuestion(assignment, question);
		return;
	}

	const questionSet = part.question_set;
	const orderedContents = questionSet && new OrderedContents(questionSet);
	let save;

	if (!questionSet) {
		logger.error('Unknown state, assignment part without questionSet!!!');
		save = Promise.reject();
	} else if (!orderedContents.canEdit) {
		logger.warn('Unable to edit question set, dropping it on the floor');
	} else if (index === Infinity) {
		save = orderedContents.append(question);
	} else {
		save = orderedContents.insertAt(question, index);
	}


	return save
		.then(() => {
			dispatch(SAVE_ENDED);
			dispatch(QUESTION_SET_UPDATED, questionSet);
		})
		.catch((reason) => {
			logger.error('Unable to append question: ', reason);
			dispatch(QUESTION_SET_ERROR, reason);
		});
}


function append (assignment, question) {
	const {parts} = assignment;
	const part = parts && parts[0];

	insertAt(assignment, part, Infinity, question);
}


function insertAfter (assignment, newQuestion, after) {
	const {parts} = assignment;
	let position = {
		index: -1,
		part: null
	};

	for (let part of parts) {
		let questionSet = part.question_set;
		let {questions} = questionSet;

		for (let i = 0; i < questions.length; i++) {
			let question = questions[i];

			if (question.NTIID === after.NTIID) {
				position.index = i + 1;
				position.part = part;
				break;
			}
		}

		if (position.part) {
			break;
		}
	}

	return insertAt(assignment, position.part, position.index, newQuestion);
}


export function appendQuestionTo (assignment, question, after) {
	if (!after) {
		append(assignment, question);
	} else {
		insertAfter(assignment, question, after);
	}
}


function partsEqual (partA, partB) {
	const equalityCheck = getEqualityCheck(partA.MimeType);
	let equal = true;

	if (partA.MimeType !== partB.MimeType) {
		equal = false;
	} else if (!equalityCheck(partA, partB)) {
		equal = false;
	}

	return equal;
}


export function savePartToQuestion (question, newPart) {
	const oldParts = question.parts;
	const oldPart = oldParts && oldParts[0];

	if (partsEqual(oldPart, newPart)) {
		return;
	}

	dispatch(SAVING, question);

	question.save({
		parts: [newPart]
	}).then(() => {
		dispatch(SAVE_ENDED, question);
		dispatch(QUESTION_UPDATED, question);
	}).catch((reason) => {
		logger.error('Failed to update question: ', reason);
		dispatch(SAVE_ENDED);
		dispatch(QUESTION_ERROR, {
			NTIID: question.NTIID,
			field: 'parts',
			reason
		});
	});
}
