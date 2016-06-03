import {dispatch} from 'nti-lib-dispatcher';
import Logger from 'nti-util-logger';
import {SAVING, SAVE_ENDED, QUESTION_SET_UPDATED, QUESTION_SET_ERROR} from '../Constants';
import OrderedContents from '../utils/OrderedContents';

const logger = Logger.get('assignment-questionset:Actions');

export function moveQuestion (question, questionSet, index, moveInfo, moveRoot) {
	let orderedContents = questionSet && new OrderedContents(questionSet);
	let {index:oldIndex, container:oldContainer} = moveInfo;

	if (!orderedContents || !moveRoot) {
		logger.error('Invalid ordered contents');

		dispatch(QUESTION_SET_ERROR, 'Invalid ordered contents');
	} else {
		dispatch(SAVING, questionSet);

		orderedContents.move(question, index, oldIndex, oldContainer, moveRoot)
			.then(() => {
				dispatch(SAVE_ENDED);
				dispatch(QUESTION_SET_UPDATED, questionSet);
			})
			.catch((reason) => {
				logger.error('Unable to move question: ', reason);
				dispatch(QUESTION_SET_ERROR, reason);
			});
	}
}
