function getLink (question, name) {
	return question && question.getLink && question.getLink(name);
}

export function canAddPart (question) {
	return !!getLink(question, 'InsertPart');
}

export function canMovePart (question) {
	return !!getLink(question, 'MovePart');
}

export function canRemovePart (question) {
	return !!getLink(question, 'RemovePart');
}
