export function cloneQuestionSet (questionSet) {
	const {MimeType, draw, isRandomized, isPartTypeRandomized} = questionSet;

	return {
		MimeType,
		draw,
		isRandomized,
		isPartTypeRandomized
	};
}
