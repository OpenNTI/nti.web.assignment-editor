const solutionMimeType = 'application/vnd.nextthought.assessment.orderingsolution';
const solutionClass = 'OrderingSolution';

function arrayEqual (a, b) {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
}

function solutionEqual (solutionA, solutionB) {
	const keysA = Object.keys(solutionA);
	const keysB = Object.keys(solutionB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (let key of keysA) {
		if (solutionA[key] !== solutionB[key]) {
			return false;
		}
	}

	return true;
}

function solutionsEqual (solutionsA, solutionsB) {
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

	if (partA.MimeType !== partB.MimeType) {
		equal = false;
	} else if (partA.content !== partB.content) {
		equal = false;
	} else if (!arrayEqual(partA.labels, partB.labels)) {
		equal = false;
	} else if (!arrayEqual(partA.values, partB.values)) {
		equal = false;
	} else if (!solutionsEqual(partA.solutions, partB.solutions)) {
		equal = false;
	}

	return equal;
}


function generateSolutionFor (value) {
	return {
		Class: solutionClass,
		MimeType: solutionMimeType,
		value: value
	};
}


export function generatePartFor (mimeType, content, labels, values, solution, hints) {
	return {
		MimeType: mimeType,
		content: content || '',
		labels: labels,
		values: values,
		solutions: [generateSolutionFor(solution)],
		hints: hints || []
	};
}
