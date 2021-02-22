export function generatePartFor(
	MimeType,
	content,
	maxSize,
	mimeTypes = ['*/*'],
	extensions = ['*'],
	hints = []
) {
	return {
		MimeType,
		max_file_size: maxSize,
		allowed_mime_types: mimeTypes,
		allowed_extensions: extensions,
		content,
		hints,
	};
}

export function partsEqual(/*partA, partB*/) {
	return false;
}
