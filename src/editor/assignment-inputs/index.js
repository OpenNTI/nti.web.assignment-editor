import React from 'react';
import Logger from 'nti-util-logger';

import Essay from './essay';
import FileUpload from './file-upload';
import FreeResponse from './free-response';
import MultipleChoice from './multiple-choice';
import MultipleChoiceMultipleAnwer from './multiple-choice-multiple-answer';
import Ordering from './ordering';

const logger = Logger.get('assignment-inputs:index');
const KINDS = [
	Essay,
	FileUpload,
	FreeResponse,
	MultipleChoice,
	MultipleChoiceMultipleAnwer,
	Ordering
];


function canHandle (cmp, type) {
	return (cmp.handles || []).reduce((acc, mimeType) => {
		if (mimeType.toLowerCase() === type) {
			acc = true;
		}

		return acc;
	}, false);
}


export function getEditorWidget (part, index) {
	const mimeType = part && part.MimeType && part.MimeType.toLowerCase();
	let cmp;

	for (let Type of KINDS) {
		if (canHandle(Type, mimeType)) {
			cmp = Type.editor;
			break;
		}
	}

	if (!cmp) {
		logger.error('Unsupported Question Type:', part);
		return '<span>Unsupported Question Type</span>';
	}

	return React.createElement(cmp, {
		key: part.NTIID,
		index, part
	});
}


export function getButtons (mimeTypes) {
	//TODO: filter this down to whats accepted by the schema
	if (!mimeTypes) {
		return KINDS.map((cmp) => {
			return React.createElement(cmp.button, {
				key: cmp.handles
			});
		});
	}
}
