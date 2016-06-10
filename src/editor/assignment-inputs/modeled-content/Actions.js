
export function generatePartFor(mimeType, content, solution, hints) {
	return {
		MimeType: mimeType,
		content: content || '',
		hints: hints || []
	};
}
