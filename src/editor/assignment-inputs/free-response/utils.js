import {solutionsEqual} from '../multiple-choice/utils';

const solutionType = 'application/vnd.nextthought.assessment.freeresponsesolution';
const classType = 'FreeResponseSolution';

export function partsEqual (partA, partB) {
	let equal = true;

	if (partA.mimeType !== partB.mimeType) {
		equal = false;
	} else if (partA.content !== partB.content) {
		equal = false;
	} else if (!solutionsEqual(partA.solutions, partB.solutions)) {
		equal = false;
	}

	return equal;
}


export function generateSolutionFor (value) {
	const type = solutionType;
	const cls = classType;

	return {
		Class: cls,
		MimeType: type,
		value: value || ' '		// The value must be at least one char. Default to empty space.
	};
}


export function generatePartFor (mimeType, content, solutions, hints) {
	solutions = solutions || [];

	return {
		MimeType: mimeType,
		content: content || '',
		solutions: solutions.map(solution => generateSolutionFor(solution)),
		hints: hints || []
	};
}
