const SolutionMimeType = 'application/vnd.nextthought.assessment.multiplechoicesolution';
const SolutionClass = 'MultipleChoiceSolution';

function choicesEqual (choicesA, choicesB) {
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


function solutionEqual (solutionA, solutionB) {
	if (!Array.isArray(solutionA)) {
		solutionA = [solutionA];
	}

	if (!Array.isArray(solutionB)) {
		solutionB = [solutionB];
	}

	if (solutionA.length !== solutionB.length) {
		return false;
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
