export function generatePartFor (mimeType, content, mimeTypes, extensions, maxSize, hints) {
	return {
		MimeType: mimeType,
		content: content ,
		hints: hints || []
	};
}


export function isPartEqual (/*partA, partB*/) {
	return false;
}
