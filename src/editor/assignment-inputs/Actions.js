import {dispatch} from 'nti-lib-dispatcher';
import Logger from 'nti-util-logger';
import {SAVING, SAVE_ENDED, QUESTION_SET_UPDATED, QUESTION_SET_ERROR} from '../Constants';
import OrderedContents from '../utils/OrderedContents';

const logger = Logger.get('assignment-inputs:Actions');

function createPartWithQuestion (/*assignment, question*/) {
	//TODO: figure this out
}


function append (assignment, question) {
	const {parts} = assignment;
	const part = parts && parts[parts.length - 1];

	if (!part) {
		createPartWithQuestion(assignment, question);
	}

	const questionSet = part.question_set;
	const orderedContents = questionSet && new OrderedContents(questionSet);

	if (!questionSet) {
		logger.error('Unknown state, assignment part without questionSet!!!');
		dispatch(QUESTION_SET_ERROR, questionSet);
	} else if (orderedContents.canEdit) {
		dispatch(SAVING, questionSet);

		orderedContents.append(question)
			.then(() => {
				dispatch(SAVE_ENDED);
				dispatch(QUESTION_SET_UPDATED, questionSet);
			})
			.catch((reason) => {
				logger.error('Unable to append question: ', reason);
				dispatch(QUESTION_SET_ERROR, reason);
			});
	} else {
		logger.warn('Unable to edit question set, dropping it on the floor');
	}
}


function insertAfter (/*assignment, question, after*/) {
	//TODO: Figure this out
}


export function appendQuestionTo (assignment, question, after) {
	if (!after) {
		append(assignment, question);
	} else {
		insertAfter(assignment, question, after);
	}
}
