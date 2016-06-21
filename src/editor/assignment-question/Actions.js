import {dispatch} from 'nti-lib-dispatcher';
import OrderedContents from '../utils/OrderedContents';
import {saveFieldOn} from '../Actions';
import {SAVING, SAVE_ENDED, QUESTION_UPDATED, QUESTION_ERROR, QUESTION_SET_UPDATED, QUESTION_SET_ERROR} from '../Constants';
import {cloneQuestion} from './utils';


export function saveQuestionContent (question, content) {
	const save = saveFieldOn(question, 'content', content);

	if (save && save.then) {
		save.then(() => {
			dispatch(QUESTION_UPDATED, question);
		}).catch((reason) => {
			dispatch(QUESTION_ERROR, {
				NTIID: question.NTIID,
				field: 'content',
				reason
			});
		});
	}
}


export function deleteQuestionFrom (question, questionSet) {
	const orderedContents = new OrderedContents(questionSet);

	if (orderedContents.canEdit) {
		dispatch(SAVING, questionSet);

		orderedContents.remove(question)
			.then(() => {
				dispatch(SAVE_ENDED);
				dispatch(QUESTION_SET_UPDATED, questionSet);
			})
			.catch((reason) => {
				dispatch(SAVE_ENDED);
				dispatch(QUESTION_SET_ERROR, reason);
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
			dispatch(SAVE_ENDED);
			dispatch(QUESTION_SET_UPDATED, questionSet);
		})
		.catch((reason) => {
			dispatch(SAVE_ENDED);
			dispatch(QUESTION_SET_ERROR, reason);
		});
}
