import {dispatch} from 'nti-lib-dispatcher';
import Logger from 'nti-util-logger';
import {SAVING, SAVE_ENDED, QUESTION_UPDATED, QUESTION_ERROR} from '../../Constants';

const logger = Logger.get('assignment-question:OrderingActions');

export function savePartToQuestion (question, part, content, labels, values, solution, hints) {
	const newPart = generatePartFor(part.MimeType, content, labels, values, solution, hints);

	if (partsEqual(part, newPart)) {
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
		dispatch(SAVE_ENDED, question);
		dispatch(QUESTION_ERROR, {
			NTIID: question.NTIID,
			field: 'parts',
			reason: reason
		});
	});
}
