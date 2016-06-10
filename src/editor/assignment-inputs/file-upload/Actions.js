
export function generatePartFor(mimeType, content, choices, solution, hints) {
	return {
		MimeType: mimeType,
		content: content ,
		hints: hints || []
	};
}
