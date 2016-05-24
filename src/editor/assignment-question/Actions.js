import {dispatch} from 'nti-lib-dispatcher';
import OrderedContents from '../utils/OrderedContents';
import {SAVING, QUESTION_UPDATED, QUESTION_DELETED, QUESTION_ERROR} from '../Constants';

export function saveQuestionContent (question, content) {
	const oldValue = question.content;

	if (oldValue === content) { return; }

	dispatch(SAVING, question);

	question.save({
		content: content
	}).then(() => {
		dispatch(QUESTION_UPDATED, question);
	}).catch((reason) => {
		dispatch(QUESTION_ERROR, reason);
	});
}


export function deleteQuestionFrom (question, questionSet) {
	const orderedContents = new OrderedContents(questionSet);

	dispatch(SAVING, questionSet);

	orderedContents.remove(question)
		.then(() => {
			dispatch(QUESTION_DELETED, question);
		})
		.catch((reason) => {
			dispatch(QUESTION_ERROR, reason);
		});
}
