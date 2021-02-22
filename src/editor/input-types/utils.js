function getLink(question, name) {
	return question && question.getLink && question.getLink(name);
}

export function canAddPart(question) {
	return !!getLink(question, 'InsertPart') || question.delaySaving;
}

export function canMovePart(question) {
	return !!getLink(question, 'MovePart') || question.delaySaving;
}

export function canRemovePart(question) {
	return !!getLink(question, 'RemovePart') || question.delaySaving;
}
