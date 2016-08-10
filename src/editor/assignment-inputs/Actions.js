import {dispatch} from 'nti-lib-dispatcher';
import Logger from 'nti-util-logger';

import OrderedContents from '../../ordered-contents';

import {SAVING, SAVE_ENDED, QUESTION_SET_UPDATED, QUESTION_SET_ERROR} from '../Constants';

import {createPartWithQuestion} from '../assignment-parts/Actions';
import {maybeResetAssignmentOnError} from '../Actions';

const logger = Logger.get('lib:asssignment-editor:assignment-inputs:Actions');

function insertAt (assignment, part, index, question, delaySave) {
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
		save = Promise.reject(new Error('Unable to edit question set, dropping it on the floor'));
	} else if (index === Infinity) {
		dispatch(SAVING, questionSet);
		save = orderedContents.append(question, delaySave);
	} else {
		dispatch(SAVING, questionSet);
		save = orderedContents.insertAt(question, index, delaySave);
	}


	return save
		.catch(maybeResetAssignmentOnError(assignment))
		.catch(reason => {

			//Drop the question.
			if (reason.code === 'UngradableInAutoGradeAssignment') {
				const {questions} = questionSet;
				const i = questions.indexOf(question);
				if (i >= 0) {
					questions.splice(i, 1);
					questionSet.onChange();
					// assignment.onChange();
					return;
				}
			}

			return Promise.reject(reason);
		})
		.then(() => {
			dispatch(QUESTION_SET_UPDATED, questionSet);
			dispatch(SAVE_ENDED, questionSet);
		})
		.catch((reason) => {
			logger.error('Unable to append question: ', reason);
			dispatch(QUESTION_SET_ERROR, reason);
			dispatch(SAVE_ENDED, questionSet);
		});
}


function appendQuestion (assignment, question, delaySave) {
	const {parts} = assignment;
	const part = parts && parts[0];

	insertAt(assignment, part, Infinity, question, delaySave);
}


function insertQuestionAt (assignment, newQuestion, position, delaySave) {
	const {parts} = assignment;
	const {item, before} = position;
	let insert = {
		index: -1,
		part: null
	};

	for (let part of parts) {
		let questionSet = part.question_set;
		let {questions} = questionSet;

		for (let i = 0; i < questions.length; i++) {
			let question = questions[i];

			if (question.NTIID === item.NTIID) {
				insert.index = i + (before ? 0 : 1);
				insert.part = part;
				break;
			}
		}

		if (insert.part) {
			break;
		}
	}

	return insertAt(assignment, insert.part, insert.index, newQuestion, delaySave);
}


export function appendQuestionTo (assignment, question, position, delaySave) {
	if (!position || !position.item) {
		appendQuestion(assignment, question, delaySave);
	} else {
		insertQuestionAt(assignment, question, position, delaySave);
	}
}
