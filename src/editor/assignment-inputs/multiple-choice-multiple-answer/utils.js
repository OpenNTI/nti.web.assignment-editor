import {partsEqual} from '../multiple-choice/utils';

const SolutionMimeType = 'application/vnd.nextthought.assessment.multiplechoicemultipleanswersolution';
const SolutionClass = 'MultipleChoiceMultipleAnswerSolution';

function generateSolutionFor (value) {
	return {
		Class: SolutionClass,
		MimeType: SolutionMimeType,
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

export {partsEqual};
