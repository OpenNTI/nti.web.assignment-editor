function getLink (question, name) {
	return question && question.getLink && question.getLink(name);
}

export function canAddPart (question) {
	return !!getLink(question, 'InsertPart') || question.isSaving;
}

export function canMovePart (question) {
	return !!getLink(question, 'MovePart');
}

export function canRemovePart (question) {
	return !!getLink(question, 'RemovePart');
}
