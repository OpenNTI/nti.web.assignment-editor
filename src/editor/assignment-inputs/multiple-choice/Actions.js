import {dispatch} from 'nti-lib-dispatcher';
import Logger from 'nti-util-logger';
import {SAVING, SAVE_ENDED, QUESTION_UPDATED, QUESTION_ERROR} from '../../Constants';

const SingleAnswerMimeType = 'application/vnd.nextthought.assessment.multiplechoicesolution';
const MultipleAnswerMimeType = 'application/vnd.nextthought.assessment.multiplechoicemultipleanswersolution';
const SingleAnwerClass = 'MultipleChoiceSolution';
const MultipleAnwerClass = 'MultipleChoiceMultipleAnswerSolution';



const logger = Logger.get('assignment-question:multichoicepart');
const solutionTypeFor = {
	'application/vnd.nextthought.assessment.randomizedmultiplechoicepart': SingleAnswerMimeType,
	'application/vnd.nextthought.assessment.multiplechoicepart': SingleAnswerMimeType,
	'application/vnd.nextthought.assessment.randomizedmultiplechoicemultipleanswerpart': MultipleAnswerMimeType,
	'application/vnd.nextthought.assessment.multiplechoicemultipleanswerpart': MultipleAnswerMimeType

};

const classFor = {
	'application/vnd.nextthought.assessment.randomizedmultiplechoicepart': SingleAnwerClass,
	'application/vnd.nextthought.assessment.multiplechoicepart': SingleAnwerClass,
	'application/vnd.nextthought.assessment.randomizedmultiplechoicemultipleanswerpart': MultipleAnwerClass,
	'application/vnd.nextthought.assessment.multiplechoicemultipleanswerpart': MultipleAnwerClass
};

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


export function solutionEqual (solutionA, solutionB) {
	if (!Array.isArray(solutionA)) {
		solutionA = [solutionA];
	}

	if (!Array.isArray(solutionB)) {
		solutionB = [solutionB];
	}

	let mapA = solutionA.reduce((acc, s) => {
		acc[s] = true;
		return acc;
	}, {});


	for (let b of solutionB) {
		if (!mapA[b]) {
			return false;
		}
	}

	return true;
}


export function solutionsEqual (solutionsA, solutionsB) {
	if (solutionsA.length !== solutionsB.length) {
		return false;
	}

	for (let i = 0; i < solutionsA.length; i++) {
		if (!solutionEqual(solutionsA[i].value, solutionsB[i].value)) {
			return false;
		}
	}

	return true;
}


export function partsEqual (partA, partB) {
	let equal = true;

	if (partA.mimeType !== partB.mimeType) {
		equal = false;
	} else if (partA.content !== partB.content) {
		equal = false;
	} else if (!choicesEqual(partA.choices, partB.choices)) {
		equal = false;
	} else if (!solutionsEqual(partA.solutions, partB.solutions)) {
		equal = false;
	}

	return equal;
}


export function generateSolutionFor (value, mimeType) {
	const type = solutionTypeFor[mimeType];
	const cls = classFor[mimeType];

	return {
		Class: cls,
		MimeType: type,
		value: value
	};
}


export function generatePartFor (mimeType, content, choices, solution, hints) {
	return {
		MimeType: mimeType,
		content: content || '',
		choices: choices,
		solutions: [generateSolutionFor(solution, mimeType)],
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
		dispatch(QUESTION_ERROR, {
			NTIID: question.NTIID,
			field: 'parts',
			reason
		});
	});
}
