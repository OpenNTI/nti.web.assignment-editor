import React from 'react';
import Logger from 'nti-util-logger';

import Essay from './Essay';
import FileUpload from './FileUpload';
import FreeResponse from './FreeResponse';
import MultipleChoice from './MultipleChoice';
import MultipleChoiceMultipleAnswer from './MultipleChoiceMultipleAnswer';
import Ordering from './Ordering';

const logger = Logger.get('question-inputs');

const KINDS = [
	Essay,
	FileUpload,
	FreeResponse,
	MultipleChoice,
	MultipleChoiceMultipleAnswer,
	Ordering
];


function canHandle (cmp, item) {
	let type = item && item.MimeType && item.MimeType.toLowerCase();

	return (cmp.handles || []).reduce((acc, mimeType) => {
		if (mimeType.toLowerCase() === type) {
			acc = true;
		}

		return acc;
	}, false);
}


export function getInputWidget (item, index) {
	let cmp;

	for (let Type of KINDS) {
		if (canHandle(Type, item)) {
			cmp = Type;
			break;
		}
	}

	if (!cmp) {
		logger.error('Unsupported Question Type:', item);
		return '<span>Unsupported Question Type</span>';
	}

	return React.createElement(cmp, {
		key: item.NTIID,
		index, item
	});
}
