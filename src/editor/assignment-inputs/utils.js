export function canAddPart (question) {
	return question.getLink('InsertPart');
}

export function canMovePart (question) {
	return question.getLink('MovePart');
}

export function canRemovePart (question) {
	return question.getLink('RemovePart');
}
