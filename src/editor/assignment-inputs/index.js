import React from 'react';
import Logger from 'nti-util-logger';

import ModeledContent from './modeled-content';
import FileUpload from './file-upload';
import FreeResponse from './free-response';
import MultipleChoice from './multiple-choice';
import MultipleChoiceMultipleAnwer from './multiple-choice-multiple-answer';
import Ordering from './ordering';

const PROMPT = 'Write a prompt...';
const QUESTION = 'Write a question...';

const logger = Logger.get('assignment-inputs:index');
const KINDS = [
	ModeledContent,
	FileUpload,
	FreeResponse,
	MultipleChoice,
	MultipleChoiceMultipleAnwer,
	Ordering
];

export {
	PROMPT,
	QUESTION
};


function canHandle (cmp, type) {
	return (cmp.handles || []).reduce((acc, mimeType) => {
		if (mimeType.toLowerCase() === type) {
			acc = true;
		}

		return acc;
	}, false);
}


export function getEditorWidget (part, index, question, error) {
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
		index, part, question, error
	});
}


export function getButtons (mimeTypes, assignment, activeInsert) {
	//TODO: filter this down to whats accepted by the schema
	if (!mimeTypes) {
		return KINDS.map((cmp) => {
			return React.createElement(cmp.button, {
				key: cmp.handles,
				assignment,
				activeInsert
			});
		});
	}
}


export function getEqualityCheck (mimeType) {
	let equal;

	for (let Type of KINDS) {
		if (canHandle(Type, mimeType)) {
			equal = Type.partsEqual;
		}
	}

	if (!equal) {
		logger.error('There is no equality check for type: ', mimeType, ' always say its not equal.');

		equal = () => { return false; };
	}

	return equal;
}


export function getContentPlaceholderFor (question) {
	const {parts} = question;
	let placeholder = QUESTION;

	if (!parts || parts.length !== 1) {
		return placeholder;
	}

	const part = parts[0];
	const mimeType = part && part.MimeType && part.MimeType.toLowerCase();

	for (let Type of KINDS) {
		if (canHandle(Type, mimeType)) {
			placeholder = Type.contentPlaceholder || QUESTION;
			break;
		}
	}

	return placeholder;
}

