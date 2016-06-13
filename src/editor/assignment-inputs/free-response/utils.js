const solutionType = 'application/vnd.nextthought.assessment.freeresponsesolution';
const classType = 'FreeResponseSolution';


export function generateSolutionFor (value) {
	const type = solutionType;
	const cls = classType;

	return {
		Class: cls,
		MimeType: type,
		value: value || ' '		// The value must be at least one char. Default to empty space.
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


export function isPartEqual (/*partA, partB*/) {
	return false;
}
