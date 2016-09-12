function cloneObj (obj) {
	const json = obj.toJSON ? obj.toJSON() : obj;

	let clone = {
		...json
	};

	delete clone.NTIID;
	delete clone.OID;

	return clone;
}

export function cloneSolution (solution) {
	let clone = cloneObj(solution);

	clone.Class = solution.Class;
	delete clone.weight;

	return clone;
}

export function clonePart (part) {
	let clone = cloneObj(part);

	if (part.solutions) {
		clone.solutions = part.solutions.map(cloneSolution);
	}

	delete clone.weight;

	return clone;
}


export function cloneQuestion (question) {
	const savingValues = (question.saving && question.saving.values) || {};
	const {parts, MimeType, PublicationState, content} = question;

	return {
		MimeType,
		PublicationState,
		content: savingValues.content || content,
		parts: savingValues.parts ? savingValues.parts.map(clonePart) : parts.map(clonePart)
	};
}
