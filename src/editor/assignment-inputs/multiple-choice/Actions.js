import {dispatch} from 'nti-lib-dispatcher';
import Logger from 'nti-util-logger';
import {SAVING, SAVE_ENDED, QUESTION_UPDATED, QUESTION_ERROR} from '../../Constants';

const logger = Logger.get('assignment-question:multichoicepart');

export function choicesEqual (choicesA, choicesB) {
	if (choicesA.length !== choicesB.length) {
		return false;
	}

	for (let i = 0; i < choicesA.length; i++) {
		if (choicesA[i] !== choicesB[i]) {
			return false;
		}
	}

	return true;
}

export function solutionsEqual (solutionA, solutionB) {
	if (solutionA.length !== solutionB.length) {
		return false;
	}

	for (let i = 0; i < solutionA.length; i++) {
		if (solutionA[i].value !== solutionB[i].value) {
			return false;
		}
	}

	return true;
}


export function partsEqual (partA, partB) {
	let equal = true;

	if (partA.content !== partB.content) {
		equal = false;
	} else if (!choicesEqual(partA.choices, partB.choices)) {
		equal = false;
	} else if (!solutionsEqual(partA.solutions, partB.solutions)) {
		equal = false;
	}

	return equal;
}


export function generateSolutionFor (value) {
	return {
		Class: 'MultipleChoiceSolution',
		MimeType: 'application/vnd.nextthought.assessment.multiplechoicesolution',
		value: value
	};
}


export function generatePartFor (mimeType, content, choices, solution, hints) {
	return {
		MimeType: mimeType,
		content: content || '',
		choices: choices,
		solutions: [generateSolutionFor(solution)],
		hints: hints || []
	};
}


export function savePartToQuestion (question, part, content, choices, solution, hints) {
	const newPart = generatePartFor(part.MimeType, content, choices, solution, hints);

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
		dispatch(SAVE_ENDED);
		dispatch(QUESTION_ERROR, reason);
	});
}
