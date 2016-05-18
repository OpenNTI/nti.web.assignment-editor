import {dispatch} from 'nti-lib-dispatcher';
import {SAVING, QUESTION_UPDATED, QUESTION_ERROR} from '../Constants';

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
