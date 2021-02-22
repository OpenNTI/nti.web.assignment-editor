import React from 'react';
import Logger from '@nti/util-logger';

import ModeledContent from './modeled-content';
import FileUpload from './file-upload';
import FreeResponse from './free-response';
import MultipleChoice, { Placeholder } from './multiple-choice';
import MultipleChoiceMultipleAnwer from './multiple-choice-multiple-answer';
import Ordering from './ordering';

const PROMPT = 'Write a prompt...';
const QUESTION = 'Write a question...';

const logger = Logger.get('lib:asssignment-editor:input-types');
const KINDS = [
	MultipleChoice,
	MultipleChoiceMultipleAnwer,
	ModeledContent,
	FreeResponse,
	FileUpload,
	Ordering,
];

export { PROMPT, QUESTION, Placeholder };

function canHandle(cmp, type) {
	return (cmp.handles || []).reduce((acc, mimeType) => {
		if (mimeType.toLowerCase() === type) {
			acc = true;
		}

		return acc;
	}, false);
}

export function getEditorWidget(
	part,
	index,
	question,
	error,
	onChange,
	keepStateHash
) {
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
		key: part.NTIID || `new-question-${mimeType}-${index}`,
		index,
		part,
		question,
		error,
		onChange,
		keepStateHash,
	});
}

export function getButtons(mimeTypes, assignment, activeInsert) {
	//TODO: filter this down to whats accepted by the schema
	if (!mimeTypes) {
		return KINDS.map(cmp => {
			return React.createElement(cmp.button, {
				key: cmp.handles,
				assignment,
				activeInsert,
			});
		});
	}
}

function getEqualityCheck(mimeType) {
	let equal;

	for (let Type of KINDS) {
		if (canHandle(Type, mimeType)) {
			equal = Type.partsEqual;
		}
	}

	if (!equal) {
		logger.error(
			'There is no equality check for type: ',
			mimeType,
			' always say its not equal.'
		);

		equal = () => {
			return false;
		};
	}

	return equal;
}

export function partsEqual(partsA, partsB) {
	if (partsA.length !== partsB.lenght) {
		return false;
	}

	for (let i = 0; i < partsA.length; i++) {
		let check = getEqualityCheck(partsA[i].MimeType);

		if (!check || !check(partsA[i], partsB[i])) {
			return false;
		}
	}

	return true;
}

export function getContentPlaceholderFor(question) {
	const { parts } = question;
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
